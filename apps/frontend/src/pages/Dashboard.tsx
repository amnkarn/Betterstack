import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
import { deleteWebsite, fetchWebsites } from '@/api/homeApi';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '@/components/DeleteModal';
//--------------------------------------------------------------


export default function Dashboard() {
    const navigate = useNavigate();
    const [websites, setWebsites] = useState<MonitorWebsite[]>([]);
    const [filteredWeb, setFilteredWeb] = useState<MonitorWebsite[]>([]); //filtered based on search
    const [modalOpen, setModalOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);// used for top bar refreshh icon
    const [loading, setLoading] = useState(false); // for loader


    const fetchWebs = async (isInitial = false) => {
        if (isInitial) {
            setLoading(true);
        }

        try {
            const res = await fetchWebsites();
            //console.log(res);
            setWebsites(res.map((w: any) => ({
                id: w.id,
                url: w.url,
                status: w.ticks[0] ? (w.ticks[0].status === "Up" ? "Up" : "Down") : "Unknown",
                responseTime: w.ticks[0] ? w.ticks[0].response_time_ms : 0,
                lastChecked:
                    w.ticks[0] ? new Date(w.ticks[0].createdAt).toLocaleString() : new Date().toLocaleString(),
                timeAdded: new Date(w.time_added).toLocaleString() || new Date().toLocaleString(),
                region: w.ticks[0] ? w.ticks[0].region.name : "checking"
            })));

        } catch (error) {
            console.log(error);
        } finally {
            if (isInitial) setLoading(false);
        }
    }

    useEffect(() => {
        fetchWebs(true); //initial fetch

        const interval = setInterval(async () => {
            await fetchWebs(false);
        }, 30000)

        return () => clearInterval(interval);
    }, [])

    const upCount = websites.filter((m) => m.status === "Up").length;
    const downCount = websites.filter((m) => m.status === "Down").length;

    const [search, setSearch] = useState(''); //search the website

    useEffect(() => {
        if (!search.trim()) {
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

        return () => clearTimeout(delayDebounseFn);
    }, [search, websites]);

    async function refreshMonitors() {
        setRefreshing(true);
        await fetchWebs(true);
        setRefreshing(false);
    }

    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if(deleteTargetId === null) {
            return;
        }
        setLoading(true);
        setDeleting(true);

        try {
            console.log("delete id", deleteTargetId)
            await deleteWebsite(deleteTargetId);          
        } catch (error) {
            console.log("Failed to delete", error);
        } finally {
            setDeleting(false);
            setDeleteTargetId(null);
            refreshMonitors();
            setLoading(false);
        }
    }

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
                            onClick={refreshMonitors}
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
                                {filteredWeb.length} of {websites.length}
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
                                onTogglePause={() => { }}
                                onDeleteClick={(monitor) => setDeleteTargetId(monitor)}
                            />
                        )}
                    </div>
                </div>
            </main>

            {/* Add monitor modal */}
            <AddMonitorModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                refresh={refreshMonitors}
            />

            <DeleteModal 
                deleteTargetId={deleteTargetId}
                setDeleteTargetId={setDeleteTargetId}
                onClick={handleDelete}
                deleting={deleting}
            />
        </div>
    );
}