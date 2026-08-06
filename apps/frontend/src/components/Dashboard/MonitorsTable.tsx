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
import StatusBadge from '../MonitorPage/StatusBadge';
import type { MonitorWebsite } from '@/types/monitor';
import { Activity, ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MonitorsTableProps {
    filteredMonitors: MonitorWebsite[];
    onTogglePause: (monitor: MonitorWebsite) => void;
    onDeleteClick: (monitor: string) => void;
}

export default function MonitorsTable({
    filteredMonitors,
    onDeleteClick, //return's back the id
}: MonitorsTableProps) {
    const navigate = useNavigate();


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
                        <TableHead className="text-muted-foreground font-medium">Response</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Last Check</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Time added</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filteredMonitors.map((monitor) => (
                        <TableRow
                            key={monitor.id}
                            className="group hover:bg-secondary/20 border-border"
                        >
                            <TableCell>
                                <a
                                    href={monitor.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm font-mono max-w-50 truncate"
                                >
                                    {monitor.url.replace(/^https?:\/\//, '')}
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                            </TableCell>
                            <TableCell>
                                <p className='text-primary hover:text-primary/80 transition-colors text-sm font-mono truncate'>
                                    {monitor.region === "checking" ? "checking..." : monitor.region }
                                </p>
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
                            <TableCell>
                                <span className="text-sm font-mono">
                                    {monitor.lastChecked}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm font-mono">
                                    {monitor.timeAdded}
                                </span>
                            </TableCell>
                            

                            {/* Monitor options */}
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
                                            onClick={() => navigate(`/monitor/${monitor.id}`)}
                                        >
                                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                            View Analytics
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-border" />
                                        <DropdownMenuItem
                                            className="gap-2 cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
                                            //call onDeleteClick with passing the id
                                            onClick={() => onDeleteClick(monitor.id)}
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