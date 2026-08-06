import type { DayBar } from "@/pages/MonitorPage";
import type { MonitorCheck } from "@/types/monitor";
import { format } from 'date-fns';


//used in 90D report
export default function buildDayBars(checks: MonitorCheck[]): DayBar[] {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const map = new Map<number, { total: number; down: number }>();

    for (const c of checks) {
        const ts = new Date(c.checked_at).getTime();
        const day = Math.floor(ts / dayMs) * dayMs;
        const entry = map.get(day) ?? { total: 0, down: 0 };
        entry.total++;
        if (c.status === 'Down') entry.down++;
        map.set(day, entry);
    }

    const bars: DayBar[] = [];
    for (let i = 89; i >= 0; i--) {
        const dayStart = Math.floor((now - i * dayMs) / dayMs) * dayMs;
        const entry = map.get(dayStart);
        bars.push({
            date: new Date(dayStart),
            label: format(dayStart, 'MMM d, yyyy'),
            uptimePct: entry ? ((entry.total - entry.down) / entry.total) * 100 : 0,
            total: entry?.total ?? 0,
            hasData: !!entry,
        });
    }
    return bars;
}