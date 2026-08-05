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


export interface MonitorCheck {
  id: string;
  monitor_id: string;
  status: 'Up' | 'Down';
  response_time: number | null;
  error_message: string | null;
  checked_at: string;
}