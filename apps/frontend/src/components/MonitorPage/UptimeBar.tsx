import type { DayBar } from "@/pages/MonitorPage";
import { useState } from "react";


//90 day report
export default function UptimeBar({ bars }: { bars: DayBar[] }) {
    const [hovered, setHovered] = useState<DayBar | null>(null);

    function barColor(bar: DayBar) {
        if (!bar.hasData) return 'bg-border';
        if (bar.uptimePct === 100) return 'bg-emerald-500';
        if (bar.uptimePct >= 95) return 'bg-amber-500';
        return 'bg-red-500';
    }

    return (
        <div className="relative">
            <div className="flex items-end gap-px h-8">
                {bars.map((bar, i) => (
                    <div
                        key={i}
                        className={`flex-1 rounded-sm transition-opacity cursor-default ${barColor(bar)} ${hovered && hovered !== bar ? 'opacity-50' : 'opacity-100'}`}
                        style={{ height: bar.hasData ? `${Math.max(30, bar.uptimePct)}%` : '30%' }}
                        onMouseEnter={() => {
                            setHovered(bar);
                        }}
                        onMouseLeave={() => setHovered(null)}
                    />
                ))}
            </div>

            {/* Hover tooltip */}
            {hovered && (
                <div
                    className="absolute bottom-10 bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl whitespace-nowrap pointer-events-none z-10"
                    style={{ left: '50%', transform: 'translateX(-50%)' }}
                >
                    <p className="text-foreground font-medium">{hovered.label}</p>
                    {hovered.hasData ? (
                        <p className="text-muted-foreground mt-0.5">
                            {hovered.uptimePct.toFixed(2)}% uptime &middot; {hovered.total} checks
                        </p>
                    ) : (
                        <p className="text-muted-foreground mt-0.5">No data</p>
                    )}
                </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 mt-2">
                {[
                    { color: 'bg-emerald-500', label: '100%' },
                    { color: 'bg-amber-500', label: '≥ 95%' },
                    { color: 'bg-red-500', label: '< 95%' },
                    { color: 'bg-border', label: 'No data' },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                        {item.label}
                    </div>
                ))}
                <span className="ml-auto text-xs text-muted-foreground">90 days</span>
            </div>
        </div>
    );
}