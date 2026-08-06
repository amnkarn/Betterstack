import type { MonitorCheck } from "@/types/monitor";

export interface Incident {
    start: Date;
    end: Date | null;
    durationMs: number;
}


//
export default function detectIncidents(checks: MonitorCheck[]): Incident[] {
    const sorted = [...checks].sort(
        (a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime(),
    );

    const incidents: Incident[] = [];
    let start: Date | null = null;

    for (const c of sorted) {
        if (c.status === 'Down' && !start) {
            start = new Date(c.checked_at);
        } else if (c.status === 'Up' && start) {
            const end = new Date(c.checked_at);
            incidents.push({ start, end, durationMs: end.getTime() - start.getTime() });
            start = null;
        }
    }
    if (start) {
        const end = new Date();
        incidents.push({ start, end: null, durationMs: end.getTime() - start.getTime() });
    }

    return incidents.reverse();
}