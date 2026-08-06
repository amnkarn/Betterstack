import { useEffect, useState, useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea,
    ReferenceLine,
} from 'recharts';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWebsite } from '@/api/homeApi';
import { type MonitorCheck, type MonitorResponse } from '@/types/monitor';
import { PageShell } from '@/components/MonitorPage/PageShell';
import StatBox from '@/components/MonitorPage/StatBox';
import detectIncidents from '@/helpers/detectIncidents';
import UptimeBar from '@/components/MonitorPage/UptimeBar';
import buildDayBars from '@/helpers/buildDayBars';
import { format } from 'date-fns';
import Incidents from '@/components/MonitorPage/Insidents';


// ─── Types ───────────────────────────────────────────────────────────────────
interface ChartPoint {
    label: string;
    timestamp: number;
    avgResponse: number | null;
    uptimePct: number;
    total: number;
    down: number;
}

export interface DayBar {
    date: Date;
    label: string;
    uptimePct: number;
    total: number;
    hasData: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
type TimeRange = '1H' | '24H' | '7D' | '30D';

const TIME_RANGES: { label: TimeRange; hours: number }[] = [
    { label: '1H', hours: 1 },
    { label: '24H', hours: 24 },
    { label: '7D', hours: 168 },
    { label: '30D', hours: 720 },
];

function getBucketMs(range: TimeRange): number {
    const map: Record<TimeRange, number> = {
        '1H': 60 * 60 * 1000,          // 1 hour
        '24H': 24 * 60 * 60 * 1000,       // 24 hours
        '7D': 7 * 24 * 60 * 60 * 1000,     // 7 day
        '30D': 30 * 24 * 60 * 60 * 1000,     // 30 day
    };
    return map[range];
}

function getXAxisFormat(range: TimeRange): (ts: number) => string {
    const fmts: Record<TimeRange, string> = {
        '1H': 'HH:mm',
        '24H': 'HH:mm',
        '7D': 'MMM d',
        '30D': 'MMM d',
    };
    return (ts: number) => format(ts, fmts[range]);
}

function bucketChecks(checks: MonitorCheck[], bucketMs: number): ChartPoint[] {
    const map = new Map<number, { sum: number; count: number; down: number }>();

    for (const c of checks) {
        const ts = new Date(c.checked_at).getTime();
        const bucket = Math.floor(ts / bucketMs) * bucketMs;
        const entry = map.get(bucket) ?? { sum: 0, count: 0, down: 0 };
        if (c.response_time != null) entry.sum += c.response_time;
        entry.count++;
        if (c.status === 'Down') entry.down++;
        map.set(bucket, entry);
    }

    return Array.from(map.entries())
        .map(([ts, { sum, count, down }]) => ({
            label: format(ts, 'MMM d, HH:mm'),
            timestamp: ts,
            avgResponse: count - down > 0 ? Math.round(sum / (count - down)) : null,
            uptimePct: count === 0 ? 100 : ((count - down) / count) * 100,
            total: count,
            down,
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
}

//used in chart
function ChartTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload as ChartPoint;
    if (!d) return null;
    return (
        <div className="bg-card border border-border rounded-lg px-3 py-2.5 text-xs shadow-xl">
            <p className="text-muted-foreground mb-1.5">{d.label}</p>
            {d.avgResponse != null ? (
                <p className="text-foreground font-mono">
                    Response: <span className="text-sky-400">{d.avgResponse} ms</span>
                </p>
            ) : (
                <p className="text-red-400 font-mono">Down</p>
            )}
            <p className="text-muted-foreground mt-1">
                Uptime: {d.uptimePct.toFixed(1)}% &middot; {d.total} checks
            </p>
        </div>
    );
}


// ─── Main component ───────────────────────────────────────────────────────────

export default function MonitorPage() {
    const navigate = useNavigate();
    const params = useParams();
    const websiteId = (params.websiteId as string);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [monitor, setMonitor] = useState<MonitorResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const [fetchRange, setFetchRange] = useState<TimeRange>('7D');
    const [range, setRange] = useState<TimeRange>('24H'); //time range for filter
    const rangeWeight = { "1H": 1, "24H": 2, "7D": 3, "30D": 4 }; //to check which range is big
    const [allChecks, setAllChecks] = useState<MonitorCheck[]>([]); //all data of the web
    const [checks, setChecks] = useState<MonitorCheck[]>([]); //data of filtered range


    const upChecks = checks.filter((c) => c.status === 'Up'); //filter from checks data
    //used in uptime stat box
    const uptimePct = checks.length > 0 ? ((upChecks.length / checks.length) * 100).toFixed(2) : null;

    const responseTimes = upChecks.map((c) => c.response_time!).filter((r) => r != null); //filtered from upChecks
    const avgResponse = responseTimes.length //avg statBox
        ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
        : null;
    const minResponse = responseTimes.length ? Math.min(...responseTimes) : null; //fastet statBox
    const maxResponse = responseTimes.length ? Math.max(...responseTimes) : null; //slowest statBox

    //detect all the failed checks from checks
    const incidents = useMemo(() => detectIncidents(checks), [checks]);

    // Derived stats
    const chartPoints = useMemo(
        () => bucketChecks(checks, getBucketMs(range)),
        [checks, range],
    );

    const dayBars = useMemo(() => buildDayBars(allChecks), [allChecks]);

    // Detect down periods for chart reference areas
    const downPeriods = useMemo(() => {
        const periods: { x1: number; x2: number }[] = [];
        let start: number | null = null;
        for (const pt of chartPoints) {
            if (pt.down > 0 && pt.total === pt.down && !start) {
                start = pt.timestamp;
            } else if ((pt.down === 0 || pt.total !== pt.down) && start) {
                periods.push({ x1: start, x2: pt.timestamp });
                start = null;
            }
        }
        if (start) periods.push({ x1: start, x2: chartPoints.at(-1)?.timestamp ?? start });
        return periods;
    }, [chartPoints]);

    const xFmt = getXAxisFormat(range);

    //----------------------------------
    async function fetchWeb(t: string) {
        try {
            setLoading(true);
            //return data >= the range
            const res = await fetchWebsite(websiteId, t);
            if (res) {
                setMonitor(res);
            }

            const mappedChecks = (res?.ticks || []).map((t: any) => ({
                id: t.id,
                monitor_id: t.website_id,
                status: t.status,
                response_time: t.response_time_ms,
                error_message: null,
                checked_at: t.createdAt
            }));

            setAllChecks(mappedChecks); //set all data in allChecks

        } catch (error) {
            console.log("Failed to fetch website: ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchWeb('7D');
        setFetchRange('7D');
    }, [websiteId]);

    // Watch for Range Clicks
    useEffect(() => {
        const currentWeight = rangeWeight[range as keyof typeof rangeWeight] || 1;
        const fetchedWeight = rangeWeight[fetchRange as keyof typeof rangeWeight] || 1;

        if (currentWeight > fetchedWeight) {
            // larger range than we have downloaded
            fetchWeb(range);
            setFetchRange(range);
        } else {
            // Just filter it locally
            const hoursMap: Record<string, number> = { '1H': 1, '24H': 24, '7D': 168, '30D': 720 };
            const hours = hoursMap[range] || 24;
            const cutoff = Date.now() - hours * 60 * 60 * 1000;

            setChecks(allChecks.filter((c) => new Date(c.checked_at).getTime() >= cutoff));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [range, allChecks, fetchRange]);

    async function refreshMonitor() {
        setRefreshing(true);
        await fetchWeb(fetchRange);
        setRefreshing(false);
    }

    if (loading) {
        return (
            <PageShell monitor={monitor} onBack={() => navigate("/home")} onRefresh={refreshMonitor} refreshing={refreshing}>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                </div>
            </PageShell>
        );
    }


    return (
        <PageShell monitor={monitor} onBack={() => navigate("/home")} onRefresh={refreshMonitor} refreshing={refreshing}>
            {/* Show all time range, and set in 'setRange' state */}
            <div className="flex items-center gap-1 border border-border rounded-lg p-1 w-fit bg-card">
                {TIME_RANGES.map(({ label }) => (
                    <button
                        key={label}
                        onClick={() => setRange(label)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${range === label
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatBox
                    label="Uptime"
                    value={uptimePct != null ? `${uptimePct}%` : '—'}
                    sub={`${range} period`}
                    tone={
                        uptimePct == null
                            ? 'neutral'
                            : Number(uptimePct) >= 99.9
                                ? 'green'
                                : Number(uptimePct) < 95
                                    ? 'red'
                                    : 'neutral'
                    }
                />
                <StatBox
                    label="Avg response"
                    value={avgResponse != null ? `${avgResponse} ms` : '—'}
                    sub={responseTimes.length ? `${responseTimes.length} checks` : undefined}
                    tone={
                        avgResponse == null
                            ? 'neutral'
                            : avgResponse < 300
                                ? 'green'
                                : avgResponse > 800
                                    ? 'red'
                                    : 'neutral'
                    }
                />
                <StatBox
                    label="Incidents"
                    value={String(incidents.length)}
                    sub={incidents.length > 0 ? `in ${range}` : 'none detected'}
                    tone={incidents.length === 0 ? 'green' : incidents.length > 2 ? 'red' : 'neutral'}
                />
                <StatBox
                    label="Total checks"
                    value={checks.length.toLocaleString()}
                    sub={`in ${range}`}
                />
                <StatBox
                    label="Fastest"
                    value={minResponse != null ? `${minResponse} ms` : '—'}
                    tone="green"
                />
                <StatBox
                    label="Slowest"
                    value={maxResponse != null ? `${maxResponse} ms` : '—'}
                    tone={maxResponse != null && maxResponse > 1000 ? 'red' : 'neutral'}
                />
            </div>

            {/* Response time chart */}
            <div className="border border-border rounded-lg bg-card">
                <div className="px-5 py-4 border-b border-border">
                    <p className="text-sm font-medium text-foreground">Response time</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Average per bucket &middot; red areas indicate downtime
                    </p>
                </div>
                <div className="px-2 pt-4 pb-2">
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={chartPoints} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                            <defs>
                                <linearGradient id="respGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.38} />
                                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--foreground))" strokeOpacity={0.1} vertical={false} />
                            <XAxis
                                dataKey="timestamp"
                                type="number"
                                scale="time"
                                domain={['dataMin', 'dataMax']}
                                tickFormatter={xFmt}
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                                minTickGap={40}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `${v}`}
                                unit=" ms"
                                width={52}
                            />
                            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(var(--foreground))', strokeOpacity: 0.1, strokeWidth: 1 }} />
                            {/* Avg response reference line */}
                            {avgResponse && (
                                <ReferenceLine
                                    y={avgResponse}
                                    stroke="rgba(56,189,248,0.3)"
                                    strokeDasharray="4 4"
                                    label={false}
                                />
                            )}
                            {/* Down period shading */}
                            {downPeriods.map((p, i) => (
                                <ReferenceArea
                                    key={i}
                                    x1={p.x1}
                                    x2={p.x2}
                                    fill="rgba(239,68,68,0.08)"
                                    stroke="rgba(239,68,68,0.2)"
                                    strokeWidth={1}
                                />
                            ))}
                            <Area
                                type="monotone"
                                dataKey="avgResponse"
                                stroke="#38bdf8"
                                strokeWidth={1.5}
                                fill="url(#respGrad)"
                                dot={false}
                                connectNulls={false}
                                activeDot={{ r: 3, fill: '#38bdf8', stroke: 'none' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 90-day uptime history */}
            <div className="border border-border rounded-lg bg-card px-5 py-4">
                <p className="text-sm font-medium text-foreground mb-1">Uptime history</p>
                <p className="text-xs text-muted-foreground mb-4">Past 90 days</p>
                <UptimeBar bars={dayBars} />
            </div>

            {/* Incidents */}
            <Incidents incidents={incidents} range={range} />
        </PageShell >
    );
}