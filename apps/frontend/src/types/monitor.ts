export type WebsiteStatus = 'Up' | 'Down' | 'Unknown';

export interface MonitorWebsite {
    id: string;
    url: string;
    status: WebsiteStatus;
    responseTime: number | null;
    lastChecked: number;
    region: string;
    time_added: string;
}
