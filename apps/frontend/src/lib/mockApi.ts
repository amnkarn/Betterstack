import type { Monitor, MonitorStatus } from '@/types/monitor';

// Mock data storage
let mockMonitors: Monitor[] = [
    {
        id: '1',
        name: 'Production API',
        url: 'https://api.example.com',
        status: 'up',
        response_time: 142,
        uptime_percentage: 99.95,
        check_interval: 60,
        last_checked: new Date(Date.now() - 120000).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
        id: '2',
        name: 'Website',
        url: 'https://example.com',
        status: 'up',
        response_time: 89,
        uptime_percentage: 99.99,
        check_interval: 30,
        last_checked: new Date(Date.now() - 60000).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
        id: '3',
        name: 'Database Server',
        url: 'https://db.example.com',
        status: 'down',
        response_time: null,
        uptime_percentage: 98.45,
        check_interval: 60,
        last_checked: new Date(Date.now() - 300000).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
        id: '4',
        name: 'CDN Endpoint',
        url: 'https://cdn.example.com',
        status: 'paused',
        response_time: 245,
        uptime_percentage: 99.87,
        check_interval: 120,
        last_checked: new Date(Date.now() - 3600000).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
];

export const mockApi = {
    async getMonitors(): Promise<Monitor[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...mockMonitors].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    },

    async createMonitor(data: Omit<Monitor, 'id' | 'created_at' | 'status' | 'response_time' | 'uptime_percentage' | 'last_checked'>): Promise<Monitor> {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const newMonitor: Monitor = {
            ...data,
            id: Date.now().toString(),
            status: 'unknown',
            response_time: null,
            uptime_percentage: 100,
            last_checked: null,
            created_at: new Date().toISOString(),
        };
        
        mockMonitors.unshift(newMonitor);
        return newMonitor;
    },

    async updateMonitorStatus(id: string, status: MonitorStatus): Promise<Monitor | null> {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const index = mockMonitors.findIndex(m => m.id === id);
        if (index === -1) return null;
        
        mockMonitors[index] = {
            ...mockMonitors[index],
            status,
            last_checked: new Date().toISOString(),
        };
        
        return mockMonitors[index];
    },

    async deleteMonitor(id: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const index = mockMonitors.findIndex(m => m.id === id);
        if (index === -1) return false;
        
        mockMonitors.splice(index, 1);
        return true;
    }
};
