import { Button } from '@/components/ui/Button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import StatusBadge from './StatusBadge';
import type { MonitorWebsite } from '@/types/monitor';
import { Activity, ExternalLink, MoreHorizontal, Pause, Play, Trash2 } from 'lucide-react';

interface MonitorsTableProps {
    filteredMonitors: MonitorWebsite[];
    onTogglePause: (monitor: MonitorWebsite) => void;
    onDeleteClick: (monitor: MonitorWebsite) => void;
}

//function formatInterval(seconds: number) {
//    if (seconds < 60) return `${seconds}s`;
//    if (seconds < 3600) return `${seconds / 60}m`;
//    return `${seconds / 3600}h`;
//}

//function formatDistanceToNow(date: Date): string {
//    const now = new Date();
//    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
//    if (diffInSeconds < 60) return 'just now';
//    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
//    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
//    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
//    return date.toLocaleDateString();
//}



export default function MonitorsTable({
    filteredMonitors,
    onTogglePause,
    onDeleteClick,
}: MonitorsTableProps) {
    if (filteredMonitors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
                    <Activity className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">No monitors yet</p>
                <p className="text-muted-foreground text-sm max-w-sm mb-6">
                    Add your first monitor to start tracking uptime and get alerted when things go wrong.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground font-medium pl-5">URL</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Region</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                        <TableHead className="text-muted-foreground font-medium">
                            Response
                        </TableHead>
                        <TableHead className="text-muted-foreground font-medium">Uptime</TableHead>
                        <TableHead className="text-muted-foreground font-medium">
                            Time added
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredMonitors.map((monitor) => (
                        <TableRow
                            key={monitor.id}
                            className="group hover:bg-secondary/20 border-border"
                        >
                            <TableCell className="pl-5 font-medium text-foreground py-4">
                                {monitor.url}
                            </TableCell>
                            <TableCell>
                                <a
                                    href={monitor.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm font-mono max-w-[200px] truncate"
                                >
                                    {monitor.url.replace(/^https?:\/\//, '')}
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={monitor.status} />
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {monitor.responseTime != null ? (
                                    <span
                                        className={
                                            monitor.responseTime < 200
                                                ? 'text-emerald-400'
                                                : monitor.responseTime < 800
                                                    ? 'text-amber-400'
                                                    : 'text-red-400'
                                        }
                                    >
                                        {monitor.responseTime} ms
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground/50">—</span>
                                )}
                            </TableCell>
                            {/*<TableCell>
                                <span
                                    className={`text-sm font-mono ${Number(monitor.uptime_percentage) >= 99.9
                                        ? 'text-emerald-400'
                                        : Number(monitor.uptime_percentage) >= 95
                                            ? 'text-amber-400'
                                            : 'text-red-400'
                                        }`}
                                >
                                    {Number(monitor.uptime_percentage).toFixed(2)}%
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatInterval(monitor.check_interval)}
                                </div>
                            </TableCell>*/}
                            
                            <TableCell className="pr-5 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="bg-card border-border text-foreground w-44"
                                    >
                                        <DropdownMenuItem
                                            className="gap-2 cursor-pointer hover:bg-secondary focus:bg-secondary"
                                            onClick={() =>
                                                window.open(monitor.url, '_blank', 'noopener,noreferrer')
                                            }
                                        >
                                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                            Visit URL
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="gap-2 cursor-pointer hover:bg-secondary/50 focus:bg-secondary/50"
                                            onClick={() => onTogglePause(monitor)}
                                        >
                                            {monitor.status === 'Unknown' ? (
                                                <>
                                                    <Play className="w-4 h-4 text-emerald-400" />
                                                    Resume
                                                </>
                                            ) : (
                                                <>
                                                    <Pause className="w-4 h-4 text-amber-400" />
                                                    Pause
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-border" />
                                        <DropdownMenuItem
                                            className="gap-2 cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
                                            onClick={() => onDeleteClick(monitor)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}