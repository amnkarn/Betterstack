import { Activity, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function DashboardSidebar() {
    const navigate = useNavigate();

    function handleLogout() {
        // Deleting a cookie named "token"
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/");
    }

    return (
        <aside className="fixed top-0 left-0 bottom-0 w-60 border-r border-border bg-card/60 backdrop-blur-sm flex flex-col z-40 hidden lg:flex">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-border">
                <button onClick={() => navigate("/home")} className="flex items-center gap-2 group w-full">
                    <div className="w-8 h-8 rounded-lg border-2 border-zinc-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <img className="rounded-2xl object-cover" src='./logo.png' />
                    </div>
                    <span className="font-bold text-foreground text-base">PulseWatch</span>
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <NavItem icon={Activity} label="Monitors" active />
            </nav>

            {/* Back to landing */}
            <div className="px-3 py-4 border-t bg-[#FEE9EA] hover:bg-[#FF6467]/50">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors pr-8"
                >
                    <ArrowLeft className="w-4 h-4 " />
                    Logout
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