//import { useEffect, useState, useCallback, useMemo } from 'react';
//import {
//  AreaChart,
//  Area,
//  XAxis,
//  YAxis,
//  CartesianGrid,
//  Tooltip,
//  ResponsiveContainer,
//  ReferenceArea,
//  ReferenceLine,
//} from 'recharts';
//import { format, subHours, subDays, formatDistanceStrict } from 'date-fns';
//import { supabase } from '@/lib/supabase';
//import type { Monitor, MonitorCheck } from '@/types/monitor';
//import { Button } from '@/components/ui/button';
//import {
//  Table,
//  TableBody,
//  TableCell,
//  TableHead,
//  TableHeader,
//  TableRow,
//} from '@/components/ui/table';
//import {
//  ArrowLeft,
//  ExternalLink,
//  RefreshCw,
//  Loader2,
//  Activity,
//  Database,
//} from 'lucide-react';
//import { useParams } from 'react-router-dom';

//// ─── Types ───────────────────────────────────────────────────────────────────

//interface Props {
//  monitor: Monitor;
//  onBack: () => void;
//}

//type TimeRange = '24H' | '7D' | '30D' | '90D';

//interface ChartPoint {
//  label: string;
//  timestamp: number;
//  avgResponse: number | null;
//  uptimePct: number;
//  total: number;
//  down: number;
//}

//interface DayBar {
//  date: Date;
//  label: string;
//  uptimePct: number;
//  total: number;
//  hasData: boolean;
//}

//interface Incident {
//  start: Date;
//  end: Date | null;
//  durationMs: number;
//}

//// ─── Helpers ─────────────────────────────────────────────────────────────────

//const TIME_RANGES: { label: TimeRange; hours: number }[] = [
//  { label: '24H', hours: 24 },
//  { label: '7D', hours: 168 },
//  { label: '30D', hours: 720 },
//  { label: '90D', hours: 2160 },
//];

//function getBucketMs(range: TimeRange): number {
//  const map: Record<TimeRange, number> = {
//    '24H': 60 * 60 * 1000,          // 1 hour
//    '7D': 6 * 60 * 60 * 1000,       // 6 hours
//    '30D': 24 * 60 * 60 * 1000,     // 1 day
//    '90D': 24 * 60 * 60 * 1000,     // 1 day
//  };
//  return map[range];
//}

//function getXAxisFormat(range: TimeRange): (ts: number) => string {
//  const fmts: Record<TimeRange, string> = {
//    '24H': 'HH:mm',
//    '7D': 'MMM d',
//    '30D': 'MMM d',
//    '90D': 'MMM d',
//  };
//  return (ts: number) => format(ts, fmts[range]);
//}

//function bucketChecks(checks: MonitorCheck[], bucketMs: number): ChartPoint[] {
//  const map = new Map<number, { sum: number; count: number; down: number }>();

//  for (const c of checks) {
//    const ts = new Date(c.checked_at).getTime();
//    const bucket = Math.floor(ts / bucketMs) * bucketMs;
//    const entry = map.get(bucket) ?? { sum: 0, count: 0, down: 0 };
//    if (c.response_time != null) entry.sum += c.response_time;
//    entry.count++;
//    if (c.status === 'down') entry.down++;
//    map.set(bucket, entry);
//  }

//  return Array.from(map.entries())
//    .map(([ts, { sum, count, down }]) => ({
//      label: format(ts, 'MMM d, HH:mm'),
//      timestamp: ts,
//      avgResponse: count - down > 0 ? Math.round(sum / (count - down)) : null,
//      uptimePct: count === 0 ? 100 : ((count - down) / count) * 100,
//      total: count,
//      down,
//    }))
//    .sort((a, b) => a.timestamp - b.timestamp);
//}

//function buildDayBars(checks: MonitorCheck[]): DayBar[] {
//  const now = Date.now();
//  const dayMs = 24 * 60 * 60 * 1000;
//  const map = new Map<number, { total: number; down: number }>();

//  for (const c of checks) {
//    const ts = new Date(c.checked_at).getTime();
//    const day = Math.floor(ts / dayMs) * dayMs;
//    const entry = map.get(day) ?? { total: 0, down: 0 };
//    entry.total++;
//    if (c.status === 'down') entry.down++;
//    map.set(day, entry);
//  }

//  const bars: DayBar[] = [];
//  for (let i = 89; i >= 0; i--) {
//    const dayStart = Math.floor((now - i * dayMs) / dayMs) * dayMs;
//    const entry = map.get(dayStart);
//    bars.push({
//      date: new Date(dayStart),
//      label: format(dayStart, 'MMM d, yyyy'),
//      uptimePct: entry ? ((entry.total - entry.down) / entry.total) * 100 : 0,
//      total: entry?.total ?? 0,
//      hasData: !!entry,
//    });
//  }
//  return bars;
//}

//function detectIncidents(checks: MonitorCheck[]): Incident[] {
//  const sorted = [...checks].sort(
//    (a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime(),
//  );

//  const incidents: Incident[] = [];
//  let start: Date | null = null;

//  for (const c of sorted) {
//    if (c.status === 'down' && !start) {
//      start = new Date(c.checked_at);
//    } else if (c.status === 'up' && start) {
//      const end = new Date(c.checked_at);
//      incidents.push({ start, end, durationMs: end.getTime() - start.getTime() });
//      start = null;
//    }
//  }
//  if (start) {
//    const end = new Date();
//    incidents.push({ start, end: null, durationMs: end.getTime() - start.getTime() });
//  }

//  return incidents.reverse();
//}

//// ─── Seed data generator ──────────────────────────────────────────────────────

//async function insertSeedChecks(monitorId: string) {
//  const now = Date.now();
//  const hourMs = 60 * 60 * 1000;

//  const outages = [
//    { start: now - 87 * 24 * hourMs, duration: 2.5 * hourMs },
//    { start: now - 65 * 24 * hourMs, duration: 1 * hourMs },
//    { start: now - 43 * 24 * hourMs, duration: 3 * hourMs },
//    { start: now - 22 * 24 * hourMs, duration: 1.5 * hourMs },
//    { start: now - 5 * 24 * hourMs, duration: 0.75 * hourMs },
//    { start: now - 18 * hourMs, duration: 0.4 * hourMs },
//  ];

//  const inOutage = (t: number) =>
//    outages.some((o) => t >= o.start && t <= o.start + o.duration);

//  const rows: object[] = [];
//  for (let t = now - 90 * 24 * hourMs; t <= now; t += hourMs) {
//    const down = inOutage(t);
//    const base = 160 + Math.sin(t / (12 * hourMs)) * 30;
//    const jitter = (Math.random() - 0.5) * 60;
//    const spike = !down && Math.random() > 0.97 ? Math.random() * 600 : 0;
//    rows.push({
//      monitor_id: monitorId,
//      status: down ? 'down' : 'up',
//      response_time: down ? null : Math.round(Math.max(50, base + jitter + spike)),
//      error_message: down ? 'Connection timed out' : null,
//      checked_at: new Date(t).toISOString(),
//    });
//  }

//  const BATCH = 500;
//  for (let i = 0; i < rows.length; i += BATCH) {
//    const { error } = await supabase.from('monitor_checks').insert(rows.slice(i, i + BATCH));
//    if (error) throw error;
//  }
//}

//// ─── Sub-components ───────────────────────────────────────────────────────────

//function StatBox({
//  label,
//  value,
//  sub,
//  tone,
//}: {
//  label: string;
//  value: string;
//  sub?: string;
//  tone?: 'green' | 'red' | 'neutral';
//}) {
//  const valueColor =
//    tone === 'green'
//      ? 'text-emerald-400'
//      : tone === 'red'
//      ? 'text-red-400'
//      : 'text-white';

//  return (
//    <div className="bg-card border border-border rounded-lg px-5 py-4">
//      <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
//        {label}
//      </p>
//      <p className={`text-2xl font-bold font-mono leading-none ${valueColor}`}>{value}</p>
//      {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
//    </div>
//  );
//}

//function ChartTooltip({ active, payload, label }: any) {
//  if (!active || !payload?.length) return null;
//  const d = payload[0]?.payload as ChartPoint;
//  if (!d) return null;
//  return (
//    <div className="bg-card border border-border rounded-lg px-3 py-2.5 text-xs shadow-xl">
//      <p className="text-muted-foreground mb-1.5">{d.label}</p>
//      {d.avgResponse != null ? (
//        <p className="text-white font-mono">
//          Response: <span className="text-sky-400">{d.avgResponse} ms</span>
//        </p>
//      ) : (
//        <p className="text-red-400 font-mono">Down</p>
//      )}
//      <p className="text-muted-foreground mt-1">
//        Uptime: {d.uptimePct.toFixed(1)}% &middot; {d.total} checks
//      </p>
//    </div>
//  );
//}

//function UptimeBar({ bars }: { bars: DayBar[] }) {
//  const [hovered, setHovered] = useState<DayBar | null>(null);
//  const [hoverX, setHoverX] = useState(0);

//  function barColor(bar: DayBar) {
//    if (!bar.hasData) return 'bg-border';
//    if (bar.uptimePct === 100) return 'bg-emerald-500';
//    if (bar.uptimePct >= 95) return 'bg-amber-500';
//    return 'bg-red-500';
//  }

//  return (
//    <div className="relative">
//      <div className="flex items-end gap-px h-8">
//        {bars.map((bar, i) => (
//          <div
//            key={i}
//            className={`flex-1 rounded-sm transition-opacity cursor-default ${barColor(bar)} ${
//              hovered && hovered !== bar ? 'opacity-50' : 'opacity-100'
//            }`}
//            style={{ height: bar.hasData ? `${Math.max(30, bar.uptimePct)}%` : '30%' }}
//            onMouseEnter={(e) => {
//              setHovered(bar);
//              setHoverX(e.currentTarget.getBoundingClientRect().left);
//            }}
//            onMouseLeave={() => setHovered(null)}
//          />
//        ))}
//      </div>

//      {/* Hover tooltip */}
//      {hovered && (
//        <div
//          className="absolute bottom-10 bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl whitespace-nowrap pointer-events-none z-10"
//          style={{ left: '50%', transform: 'translateX(-50%)' }}
//        >
//          <p className="text-white font-medium">{hovered.label}</p>
//          {hovered.hasData ? (
//            <p className="text-muted-foreground mt-0.5">
//              {hovered.uptimePct.toFixed(2)}% uptime &middot; {hovered.total} checks
//            </p>
//          ) : (
//            <p className="text-muted-foreground mt-0.5">No data</p>
//          )}
//        </div>
//      )}

//      {/* Legend */}
//      <div className="flex items-center gap-4 mt-2">
//        {[
//          { color: 'bg-emerald-500', label: '100%' },
//          { color: 'bg-amber-500', label: '≥ 95%' },
//          { color: 'bg-red-500', label: '< 95%' },
//          { color: 'bg-border', label: 'No data' },
//        ].map((item) => (
//          <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
//            <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
//            {item.label}
//          </div>
//        ))}
//        <span className="ml-auto text-xs text-muted-foreground">90 days</span>
//      </div>
//    </div>
//  );
//}

//// ─── Main component ───────────────────────────────────────────────────────────

//export default function MonitorPage() {
//  const { websiteId } = useParams();

//  const [checks, setChecks] = useState<MonitorCheck[]>([]);
//  const [allChecks, setAllChecks] = useState<MonitorCheck[]>([]);
//  const [loading, setLoading] = useState(true);
//  const [seeding, setSeeding] = useState(false);
//  const [range, setRange] = useState<TimeRange>('7D');


//  // Filter checks to selected time range
//  useEffect(() => {
//    const hoursMap: Record<TimeRange, number> = {
//      '24H': 24,
//      '7D': 168,
//      '30D': 720,
//      '90D': 2160,
//    };
//    const cutoff = subHours(new Date(), hoursMap[range]);
//    setChecks(allChecks.filter((c) => new Date(c.checked_at) >= cutoff));
//  }, [allChecks, range]);

//  async function handleSeed() {
//    setSeeding(true);
//    try {
//      await insertSeedChecks(monitor.id);
//      await fetchChecks();
//    } catch (e) {
//      console.error(e);
//    }
//    setSeeding(false);
//  }

//  // Derived stats
//  const chartPoints = useMemo(
//    () => bucketChecks(checks, getBucketMs(range)),
//    [checks, range],
//  );

//  const dayBars = useMemo(() => buildDayBars(allChecks), [allChecks]);
//  const incidents = useMemo(() => detectIncidents(checks), [checks]);

//  const upChecks = checks.filter((c) => c.status === 'up');
//  const downChecks = checks.filter((c) => c.status === 'down');
//  const responseTimes = upChecks.map((c) => c.response_time!).filter((r) => r != null);
//  const avgResponse = responseTimes.length
//    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
//    : null;
//  const minResponse = responseTimes.length ? Math.min(...responseTimes) : null;
//  const maxResponse = responseTimes.length ? Math.max(...responseTimes) : null;
//  const uptimePct =
//    checks.length > 0 ? ((upChecks.length / checks.length) * 100).toFixed(3) : null;

//  // Detect down periods for chart reference areas
//  const downPeriods = useMemo(() => {
//    const periods: { x1: number; x2: number }[] = [];
//    let start: number | null = null;
//    for (const pt of chartPoints) {
//      if (pt.down > 0 && pt.total === pt.down && !start) {
//        start = pt.timestamp;
//      } else if ((pt.down === 0 || pt.total !== pt.down) && start) {
//        periods.push({ x1: start, x2: pt.timestamp });
//        start = null;
//      }
//    }
//    if (start) periods.push({ x1: start, x2: chartPoints.at(-1)?.timestamp ?? start });
//    return periods;
//  }, [chartPoints]);

//  const xFmt = getXAxisFormat(range);
//  const hasChecks = allChecks.length > 0;

//  if (loading) {
//    return (
//      <PageShell monitor={monitor} onBack={onBack} onRefresh={fetchChecks} refreshing={false}>
//        <div className="flex items-center justify-center h-64">
//          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
//        </div>
//      </PageShell>
//    );
//  }

//  if (!hasChecks) {
//    return (
//      <PageShell monitor={monitor} onBack={onBack} onRefresh={fetchChecks} refreshing={false}>
//        <div className="flex flex-col items-center justify-center h-80 gap-4 border border-border rounded-lg bg-card">
//          <Activity className="w-8 h-8 text-muted-foreground/40" />
//          <div className="text-center">
//            <p className="text-white font-medium mb-1">No check data yet</p>
//            <p className="text-muted-foreground text-sm max-w-sm">
//              Data appears here once your monitor starts running checks. Load sample data to
//              preview the analytics.
//            </p>
//          </div>
//          <Button
//            size="sm"
//            variant="outline"
//            className="border-border text-muted-foreground hover:text-white gap-2 mt-1"
//            onClick={handleSeed}
//            disabled={seeding}
//          >
//            {seeding ? (
//              <Loader2 className="w-4 h-4 animate-spin" />
//            ) : (
//              <Database className="w-4 h-4" />
//            )}
//            {seeding ? 'Generating 90 days of data…' : 'Load sample data'}
//          </Button>
//        </div>
//      </PageShell>
//    );
//  }


//  return (
//    <PageShell monitor={monitor} onBack={onBack} onRefresh={fetchChecks} refreshing={false}>
//      {/* Time range */}
//      <div className="flex items-center gap-1 border border-border rounded-lg p-1 w-fit bg-card">
//        {TIME_RANGES.map(({ label }) => (
//          <button
//            key={label}
//            onClick={() => setRange(label)}
//            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
//              range === label
//                ? 'bg-background text-white'
//                : 'text-muted-foreground hover:text-white'
//            }`}
//          >
//            {label}
//          </button>
//        ))}
//      </div>

//      {/* Stats */}
//      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//        <StatBox
//          label="Uptime"
//          value={uptimePct != null ? `${uptimePct}%` : '—'}
//          sub={`${range} period`}
//          tone={
//            uptimePct == null
//              ? 'neutral'
//              : Number(uptimePct) >= 99.9
//              ? 'green'
//              : Number(uptimePct) < 95
//              ? 'red'
//              : 'neutral'
//          }
//        />
//        <StatBox
//          label="Avg response"
//          value={avgResponse != null ? `${avgResponse} ms` : '—'}
//          sub={responseTimes.length ? `${responseTimes.length} checks` : undefined}
//          tone={
//            avgResponse == null
//              ? 'neutral'
//              : avgResponse < 300
//              ? 'green'
//              : avgResponse > 800
//              ? 'red'
//              : 'neutral'
//          }
//        />
//        <StatBox
//          label="Incidents"
//          value={String(incidents.length)}
//          sub={incidents.length > 0 ? `in ${range}` : 'none detected'}
//          tone={incidents.length === 0 ? 'green' : incidents.length > 2 ? 'red' : 'neutral'}
//        />
//        <StatBox
//          label="Total checks"
//          value={checks.length.toLocaleString()}
//          sub={`in ${range}`}
//        />
//        <StatBox
//          label="Fastest"
//          value={minResponse != null ? `${minResponse} ms` : '—'}
//          tone="green"
//        />
//        <StatBox
//          label="Slowest"
//          value={maxResponse != null ? `${maxResponse} ms` : '—'}
//          tone={maxResponse != null && maxResponse > 1000 ? 'red' : 'neutral'}
//        />
//      </div>

//      {/* Response time chart */}
//      <div className="border border-border rounded-lg bg-card">
//        <div className="px-5 py-4 border-b border-border">
//          <p className="text-sm font-medium text-white">Response time</p>
//          <p className="text-xs text-muted-foreground mt-0.5">
//            Average per bucket &middot; red areas indicate downtime
//          </p>
//        </div>
//        <div className="px-2 pt-4 pb-2">
//          <ResponsiveContainer width="100%" height={220}>
//            <AreaChart data={chartPoints} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
//              <defs>
//                <linearGradient id="respGrad" x1="0" y1="0" x2="0" y2="1">
//                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.18} />
//                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
//                </linearGradient>
//              </defs>
//              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
//              <XAxis
//                dataKey="timestamp"
//                type="number"
//                scale="time"
//                domain={['dataMin', 'dataMax']}
//                tickFormatter={xFmt}
//                tick={{ fontSize: 11, fill: '#6b7280' }}
//                axisLine={false}
//                tickLine={false}
//                minTickGap={40}
//              />
//              <YAxis
//                tick={{ fontSize: 11, fill: '#6b7280' }}
//                axisLine={false}
//                tickLine={false}
//                tickFormatter={(v) => `${v}`}
//                unit=" ms"
//                width={52}
//              />
//              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
//              {/* Avg response reference line */}
//              {avgResponse && (
//                <ReferenceLine
//                  y={avgResponse}
//                  stroke="rgba(56,189,248,0.3)"
//                  strokeDasharray="4 4"
//                  label={false}
//                />
//              )}
//              {/* Down period shading */}
//              {downPeriods.map((p, i) => (
//                <ReferenceArea
//                  key={i}
//                  x1={p.x1}
//                  x2={p.x2}
//                  fill="rgba(239,68,68,0.08)"
//                  stroke="rgba(239,68,68,0.2)"
//                  strokeWidth={1}
//                />
//              ))}
//              <Area
//                type="monotone"
//                dataKey="avgResponse"
//                stroke="#38bdf8"
//                strokeWidth={1.5}
//                fill="url(#respGrad)"
//                dot={false}
//                connectNulls={false}
//                activeDot={{ r: 3, fill: '#38bdf8', stroke: 'none' }}
//              />
//            </AreaChart>
//          </ResponsiveContainer>
//        </div>
//      </div>

//      {/* 90-day uptime history */}
//      <div className="border border-border rounded-lg bg-card px-5 py-4">
//        <p className="text-sm font-medium text-white mb-1">Uptime history</p>
//        <p className="text-xs text-muted-foreground mb-4">Past 90 days</p>
//        <UptimeBar bars={dayBars} />
//      </div>

//      {/* Incidents */}
//      <div className="border border-border rounded-lg bg-card">
//        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
//          <div>
//            <p className="text-sm font-medium text-white">Incidents</p>
//            <p className="text-xs text-muted-foreground mt-0.5">Downtime events in {range}</p>
//          </div>
//          <span className="text-xs font-mono text-muted-foreground">
//            {incidents.length} total
//          </span>
//        </div>

//        {incidents.length === 0 ? (
//          <div className="flex items-center justify-center h-28 text-sm text-muted-foreground gap-2">
//            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
//            No incidents in this period
//          </div>
//        ) : (
//          <Table>
//            <TableHeader>
//              <TableRow className="border-border hover:bg-transparent">
//                <TableHead className="text-muted-foreground font-medium pl-5">Started</TableHead>
//                <TableHead className="text-muted-foreground font-medium">Recovered</TableHead>
//                <TableHead className="text-muted-foreground font-medium">Duration</TableHead>
//                <TableHead className="text-muted-foreground font-medium pr-5">Status</TableHead>
//              </TableRow>
//            </TableHeader>
//            <TableBody>
//              {incidents.map((inc, i) => (
//                <TableRow key={i} className="border-border hover:bg-white/[0.015]">
//                  <TableCell className="pl-5 text-sm text-white font-mono py-3">
//                    {format(inc.start, 'MMM d, HH:mm')}
//                  </TableCell>
//                  <TableCell className="text-sm text-muted-foreground font-mono">
//                    {inc.end ? format(inc.end, 'MMM d, HH:mm') : (
//                      <span className="text-red-400">Ongoing</span>
//                    )}
//                  </TableCell>
//                  <TableCell className="text-sm font-mono text-muted-foreground">
//                    {formatDistanceStrict(inc.start, inc.end ?? new Date())}
//                  </TableCell>
//                  <TableCell className="pr-5">
//                    <span
//                      className={`text-xs font-medium px-2 py-0.5 rounded border ${
//                        inc.end
//                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
//                          : 'bg-red-500/10 text-red-400 border-red-500/20'
//                      }`}
//                    >
//                      {inc.end ? 'Resolved' : 'Ongoing'}
//                    </span>
//                  </TableCell>
//                </TableRow>
//              ))}
//            </TableBody>
//          </Table>
//        )}
//      </div>
//    </PageShell>
//  );
//}

//// ─── Page shell (header + sidebar layout) ────────────────────────────────────

//function PageShell({
//  monitor,
//  onBack,
//  onRefresh,
//  refreshing,
//  children,
//}: {
//  monitor: Monitor;
//  onBack: () => void;
//  onRefresh: () => void;
//  refreshing: boolean;
//  children: React.ReactNode;
//}) {
//  const statusDot =
//    monitor.status === 'up'
//      ? 'bg-emerald-400'
//      : monitor.status === 'down'
//      ? 'bg-red-400'
//      : 'bg-slate-400';

//  return (
//    <div className="min-h-screen bg-background">
//      {/* Sidebar */}
//      <aside className="fixed top-0 left-0 bottom-0 w-60 border-r border-border bg-card/60 backdrop-blur-sm hidden lg:flex flex-col z-40">
//        <div className="px-5 py-5 border-b border-border">
//          <button onClick={onBack} className="flex items-center gap-2 group w-full">
//            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
//              <Activity className="w-4 h-4 text-white" />
//            </div>
//            <span className="font-bold text-white text-base">PulseWatch</span>
//          </button>
//        </div>
//        <nav className="flex-1 px-3 py-4 space-y-1">
//          <button
//            onClick={onBack}
//            className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
//          >
//            <Activity className="w-4 h-4" />
//            Monitors
//          </button>
//        </nav>
//      </aside>

//      <main className="lg:pl-60">
//        {/* Top bar */}
//        <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg px-6 py-4">
//          <div className="flex items-start justify-between gap-4">
//            <div>
//              {/* Breadcrumb */}
//              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
//                <button onClick={onBack} className="hover:text-white flex items-center gap-1">
//                  <ArrowLeft className="w-3 h-3" />
//                  Monitors
//                </button>
//                <span>/</span>
//                <span className="text-white">{monitor.name}</span>
//              </div>
//              {/* Name + URL */}
//              <div className="flex items-center gap-3">
//                <div className={`w-2 h-2 rounded-full ${statusDot} shrink-0`} />
//                <h1 className="text-white font-semibold text-xl leading-none">{monitor.name}</h1>
//                <a
//                  href={monitor.url}
//                  target="_blank"
//                  rel="noopener noreferrer"
//                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-white transition-colors"
//                >
//                  {monitor.url.replace(/^https?:\/\//, '')}
//                  <ExternalLink className="w-3 h-3" />
//                </a>
//              </div>
//            </div>
//            <Button
//              variant="ghost"
//              size="icon"
//              className="text-muted-foreground hover:text-white h-9 w-9 shrink-0"
//              onClick={onRefresh}
//              disabled={refreshing}
//            >
//              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//            </Button>
//          </div>
//        </div>

//        <div className="px-6 py-6 max-w-6xl mx-auto space-y-5">{children}</div>
//      </main>
//    </div>
//  );
//}
