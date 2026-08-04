import { useEffect, useState } from 'react';
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
import type { MonitorWebsite } from '@/types/monitor';
import AddMonitorModal from '@/components/AddMonitorModal';
import DashboardSidebar from '@/components/DashboardSidebar';
import StatCard from '@/components/StatCard';
import MonitorsTable from '@/components/MonitorsTable';
import ThemeToggle from '@/components/ThemeToggle';
import { fetchWebsites } from '@/api/homeApi';
import { useNavigate } from 'react-router-dom';
//--------------------------------------------------------------


export default function Dashboard() {
    const navigate = useNavigate();
    const [websites, setWebsites] = useState<MonitorWebsite[]>([]);
    const [filteredWeb, setFilteredWeb] = useState<MonitorWebsite[]>([]); //filtered based on search
    const [modalOpen, setModalOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);// used for top bar refreshh icon
    const [loading, setLoading] = useState(false); // for loader


    const fetchWebs = async () => {
        try {
            const res = await fetchWebsites();
            console.log(res);
            //@ts-ignore
            setWebsites(res.map((w: any) => ({
                id: w.id,
                url: w.url,
                status: w.ticks[0] ? (w.ticks[0].status === "Up" ? "Up" : "Down") : "checking",
                responseTime: w.ticks[0] ? w.ticks[0].response_time_ms : 0,
                lastChecked: w.ticks[0] ? new Date(w.ticks[0].createdAt).toLocaleString() :
                new Date().toLocaleString(),
                region: w.ticks[0] ? w.ticks[0].region.name : "checking"
            })));

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchWebs(); //initial fetch

        const interval = setInterval(async () => {
            await fetchWebs();
        }, 30000)

        clearInterval(interval);
    }, [])

    const upCount = websites.filter((m) => m.status === "Up").length;
    const downCount = websites.filter((m) => m.status === "Down").length;
    //const avgUptime =
    //    websites.length > 0
    //        ? (monitors.reduce((a, m) => a + Number(m.uptime_percentage), 0) / monitors.length).toFixed(2)
    //        : '—';

    const [search, setSearch] = useState(''); //search the website

    useEffect(() => {
        if(!search.trim()) {
            setFilteredWeb(websites);
            return;
        }

        const delayDebounseFn = setTimeout(() => {
            //searching logic
            const searchString = search.toLowerCase();
            const filteredWebsites = websites.filter((m) => {
                return m.url.toLowerCase().includes(searchString)
            })

            console.log(filteredWebsites);
            setFilteredWeb(filteredWebsites);
        }, 500)

        clearTimeout(delayDebounseFn);
    }, [search, websites]);


    return (
        <div className="min-h-screen bg-background">
            <DashboardSidebar />

            {/* Main */}
            <main className="lg:pl-60">
                {/* Top bar */}
                <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg px-6 py-4 flex items-center justify-between gap-4">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/")}
                            className="flex lg:hidden items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <Activity className="w-5 h-5 text-primary" />
                            <span className="font-bold text-foreground">PulseWatch</span>
                        </button>
                        <div className="hidden lg:block">
                            <h1 className="text-foreground font-semibold text-lg">Monitors</h1>
                            <p className="text-muted-foreground text-xs">
                                {websites.length} monitor{websites.length !== 1 ? 's' : ''} tracked
                            </p>
                        </div>
                    </div>
                    {/* Right side icons and button */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground h-9 w-9"
                            onClick={() => {}}
                            disabled={refreshing}
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5"
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
                            value={websites.length}
                            icon={Activity}
                            color="bg-primary/10 text-primary"
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
                            //value={avgUptime === '—' ? '—' : `${avgUptime}%`}
                            value={"89%"}
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
                                    className="pl-9 bg-background border-border text-foreground placeholder:text-muted-foreground h-9 text-sm focus-visible:ring-primary/50"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground ml-auto">
                                {/*{filtered.length} of {monitors.length}*/}
                                {1} of {websites.length}
                            </p>
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                <p className="text-muted-foreground text-sm">Loading monitors…</p>
                            </div>
                        ) : (
                            <MonitorsTable
                                filteredMonitors={filteredWeb}
                                onTogglePause={() => {}}
                                onDeleteClick={() => {}}
                            />
                        )}
                    </div>
                </div>
            </main>

            {/* Add monitor modal */}
            <AddMonitorModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />

            {/* Delete confirmation */}
            {/*<AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <AlertDialogContent className="bg-card border-border text-foreground">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete monitor?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            This will permanently delete{' '}
                            <span className="text-foreground font-medium">{deleteTarget?.name}</span> and all its data.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0"
                            onClick={() => {}}
                            disabled={deleting}
                        >
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>*/}
        </div>
    );
}
