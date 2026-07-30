import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Activity,
    Plus,
    Search,
    RefreshCw,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Loader2,
} from 'lucide-react';
import type { Monitor, MonitorStatus } from '@/types/monitor';
import AddMonitorModal from '@/components/AddMonitorModal';
import DashboardSidebar from '@/components/DashboardSidebar';
import StatCard from '@/components/StatCard';
import MonitorsTable from '@/components/MonitorsTable';
import { mockApi } from '@/lib/mockApi';

interface Props {
    onBack: () => void;
}

export default function Dashboard({ onBack }: Props) {
    const [monitors, setMonitors] = useState<Monitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Monitor | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMonitors = useCallback(async (quiet = false) => {
        if (!quiet) setLoading(true);
        else setRefreshing(true);

        try {
            const data = await mockApi.getMonitors();
            setMonitors(data);
        } catch (error) {
            console.error('Failed to fetch monitors:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchMonitors();
    }, [fetchMonitors]);

    async function togglePause(monitor: Monitor) {
        const newStatus: MonitorStatus = monitor.status === 'paused' ? 'unknown' : 'paused';
        try {
            const updated = await mockApi.updateMonitorStatus(monitor.id, newStatus);
            if (updated) {
                setMonitors((prev) => prev.map((m) => (m.id === monitor.id ? updated : m)));
            }
        } catch (error) {
            console.error('Failed to toggle pause:', error);
        }
    }

    async function deleteMonitor() {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await mockApi.deleteMonitor(deleteTarget.id);
            setMonitors((prev) => prev.filter((m) => m.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (error) {
            console.error('Failed to delete monitor:', error);
        } finally {
            setDeleting(false);
        }
    }

    const filtered = monitors.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.url.toLowerCase().includes(search.toLowerCase()),
    );

    const upCount = monitors.filter((m) => m.status === 'up').length;
    const downCount = monitors.filter((m) => m.status === 'down').length;
    const avgUptime =
        monitors.length > 0
            ? (monitors.reduce((a, m) => a + Number(m.uptime_percentage), 0) / monitors.length).toFixed(2)
            : '—';

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <DashboardSidebar onBack={onBack} />

            {/* Main */}
            <main className="lg:pl-60">
                {/* Top bar */}
                <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* Mobile logo */}
                        <button
                            onClick={onBack}
                            className="flex lg:hidden items-center gap-2 text-muted-foreground hover:text-white"
                        >
                            <Activity className="w-5 h-5 text-sky-400" />
                            <span className="font-bold text-white">PulseWatch</span>
                        </button>
                        <div className="hidden lg:block">
                            <h1 className="text-white font-semibold text-lg">Monitors</h1>
                            <p className="text-muted-foreground text-xs">
                                {monitors.length} monitor{monitors.length !== 1 ? 's' : ''} tracked
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-white h-9 w-9"
                            onClick={() => fetchMonitors(true)}
                            disabled={refreshing}
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                            size="sm"
                            className="bg-sky-500 hover:bg-sky-400 text-white font-semibold gap-1.5"
                            onClick={() => setModalOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Add monitor
                        </Button>
                    </div>
                </div>

                <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total monitors"
                            value={monitors.length}
                            icon={Activity}
                            color="bg-sky-500/10 text-sky-400"
                        />
                        <StatCard
                            label="Monitors up"
                            value={upCount}
                            icon={CheckCircle2}
                            color="bg-emerald-500/10 text-emerald-400"
                        />
                        <StatCard
                            label="Monitors down"
                            value={downCount}
                            icon={XCircle}
                            color="bg-red-500/10 text-red-400"
                        />
                        <StatCard
                            label="Avg uptime"
                            value={avgUptime === '—' ? '—' : `${avgUptime}%`}
                            icon={TrendingUp}
                            color="bg-violet-500/10 text-violet-400"
                        />
                    </div>

                    {/* Table card */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        {/* Table header */}
                        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                            <div className="relative flex-1 max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search monitors…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 bg-background border-border text-white placeholder:text-muted-foreground h-9 text-sm focus-visible:ring-sky-500/50"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground ml-auto">
                                {filtered.length} of {monitors.length}
                            </p>
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
                                <p className="text-muted-foreground text-sm">Loading monitors…</p>
                            </div>
                        ) : (
                            <MonitorsTable
                                monitors={monitors}
                                filteredMonitors={filtered}
                                onTogglePause={togglePause}
                                onDeleteClick={setDeleteTarget}
                            />
                        )}
                    </div>
                </div>
            </main>

            {/* Add monitor modal */}
            <AddMonitorModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreated={(m) => setMonitors((prev) => [m, ...prev])}
            />

            {/* Delete confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <AlertDialogContent className="bg-card border-border text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete monitor?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            This will permanently delete{' '}
                            <span className="text-white font-medium">{deleteTarget?.name}</span> and all its data.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-border text-muted-foreground hover:text-white hover:bg-white/5">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-400 text-white border-0"
                            onClick={deleteMonitor}
                            disabled={deleting}
                        >
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
