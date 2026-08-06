import { Activity, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function DashboardSidebar() {
    const navigate = useNavigate();

    return (
        <aside className="fixed top-0 left-0 bottom-0 w-60 border-r border-border bg-card/60 backdrop-blur-sm flex flex-col z-40 hidden lg:flex">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-border">
                <button onClick={() => navigate("/")} className="flex items-center gap-2 group w-full">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <Activity className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-foreground text-base">PulseWatch</span>
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <NavItem icon={Activity} label="Monitors" active />
            </nav>

            {/* Back to landing */}
            <div className="px-3 py-4 border-t border-border">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </button>
            </div>
        </aside>
    );
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
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </div>
    );
}