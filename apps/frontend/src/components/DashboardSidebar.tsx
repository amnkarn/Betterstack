import { Activity, ArrowLeft } from 'lucide-react';

interface DashboardSidebarProps {
    onBack: () => void;
}

function NavItem({
    icon: Icon,
    label,
    active,
}: {
    icon: React.ElementType;
    label: string;
    active?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${active
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </div>
    );
}

export default function DashboardSidebar({ onBack }: DashboardSidebarProps) {
    return (
        <aside className="fixed top-0 left-0 bottom-0 w-60 border-r border-border bg-card/60 backdrop-blur-sm flex flex-col z-40 hidden lg:flex">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-border">
                <button onClick={onBack} className="flex items-center gap-2 group w-full">
                    <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white text-base">PulseWatch</span>
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <NavItem icon={Activity} label="Monitors" active />
            </nav>

            {/* Back to landing */}
            <div className="px-3 py-4 border-t border-border">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </button>
            </div>
        </aside>
    );
}
