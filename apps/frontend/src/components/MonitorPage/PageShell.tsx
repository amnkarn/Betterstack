import type { MonitorResponse } from "@/types/monitor";
import { ArrowLeft, ExternalLink, RefreshCw, Activity } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { Button } from "../ui/Button";

// ─── Page shell (header + sidebar layout) ────────────────────────────────────
export function PageShell({
    monitor,
    onBack,
    onRefresh,
    refreshing,
    children,
}: {
    monitor: MonitorResponse | null;
    onBack: () => void;
    onRefresh: () => void;
    refreshing: boolean;
    children: React.ReactNode;
}) {
    const latestTick = monitor?.ticks[monitor.ticks.length - 1];
    const currentStatus = latestTick?.status || "Unknown";

    const statusDot =
        currentStatus === 'Unknown'
            ? 'bg-emerald-400'
            : currentStatus === 'Down'
                ? 'bg-red-400'
                : 'bg-slate-400';

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 bottom-0 w-60 border-r border-border bg-card/60 backdrop-blur-sm hidden lg:flex flex-col z-40">
                <div className="px-5 py-5 border-b border-border">
                    <button onClick={onBack} className="flex items-center gap-2 group w-full">
                        <div className="w-8 h-8 rounded-lg border-2 border-zinc-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <img className="rounded-2xl object-cover" src='../logo.png' />
                    </div>
                        <span className="font-bold text-foreground text-base">PulseWatch</span>
                    </button>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-1">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                        <Activity className="w-4 h-4" />
                        Monitors
                    </button>
                </nav>
            </aside>

            <main className="lg:pl-60">
                {/* Top bar */}
                <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                                <button onClick={onBack} className="hover:text-foreground flex items-center gap-1">
                                    <ArrowLeft className="w-3 h-3" />
                                    Monitors
                                </button>
                                <span>/</span>
                                <span className="text-foreground">{monitor?.url}</span>
                            </div>
                            {/* Name + URL */}
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${statusDot} shrink-0`} />
                                <a
                                    href={monitor?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {monitor?.url.replace(/^https?:\/\//, '')}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                        {/* Theme Button + Refresh */}
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground h-9 w-9 shrink-0"
                                onClick={onRefresh}
                                disabled={refreshing}
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 max-w-6xl mx-auto space-y-5">{children}</div>
            </main>
        </div>
    );
}