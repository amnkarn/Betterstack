export type WebsiteStatus = 'Up' | 'Down' | 'Unknown';

export interface MonitorWebsite {
    id: string;
    url: string;
    status: WebsiteStatus;
    responseTime: number | null;
    lastChecked: number;
    region: string;
    timeAdded: number;
}
//------------------------------
//-----Monitor page types-------

export interface MonitorTick {
    id: string;
    response_time_ms: number;
    status: WebsiteStatus;
    region_id: string;
    website_id: string;
    createdAt: string;
}

export interface MonitorResponse {
    id: string;
    url: string;
    user_id: string;
    time_added: string;
    ticks: MonitorTick[];
}

//used in graphs
export interface MonitorCheck {
    id: string;
    monitor_id: string;
    status: WebsiteStatus;
    response_time: number | null;
    error_message: string | null;
    checked_at: string
}