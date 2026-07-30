export type MonitorStatus = 'up' | 'down' | 'paused' | 'unknown';

export interface Monitor {
    id: string;
    name: string;
    url: string;
    status: MonitorStatus;
    response_time: number | null;
    uptime_percentage: number;
    check_interval: number;
    last_checked: string | null;
    created_at: string;
}
