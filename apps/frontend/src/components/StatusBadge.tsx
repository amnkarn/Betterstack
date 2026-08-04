import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from './ui/Badge';
import type { WebsiteStatus } from '@/types/monitor';

interface StatusBadgeProps {
    status: WebsiteStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const map: Record<WebsiteStatus, { label: string; icon: React.ReactNode; className: string }> = {
        Up: {
            label: 'Up',
            icon: <CheckCircle2 className="w-3 h-3" />,
            className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        },
        Down: {
            label: 'Down',
            icon: <XCircle className="w-3 h-3" />,
            className: 'bg-red-500/15 text-red-400 border-red-500/30',
        },
        Unknown: {
            label: 'Checking…',
            icon: <AlertCircle className="w-3 h-3" />,
            className: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
        },
    };

    const cfg = map[status];
    return (
        <Badge
            variant="outline"
            className={`flex items-center gap-1 w-fit text-xs font-medium px-2 py-0.5 ${cfg.className}`}
        >
            {status === 'Up' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-0.5" />}
            {status === 'Down' && <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-0.5" />}
            {cfg.icon}
            {cfg.label}
        </Badge>
    );
}
