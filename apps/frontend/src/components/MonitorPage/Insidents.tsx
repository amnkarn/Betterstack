import { format, formatDistanceStrict } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import type { Incident } from "@/helpers/detectIncidents";


type TimeRange = '1H' | '24H' | '7D' | '30D';

export default function Incidents({
    incidents,
    range,
}: {
    incidents: Incident[],
    range: TimeRange
}) {
    return (
        <div className="border border-border rounded-lg bg-card">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground">Incidents</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Downtime events in {range}</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                        {incidents.length} total
                    </span>
                </div>

                {incidents.length === 0 ? (
                    <div className="flex items-center justify-center h-28 text-sm text-muted-foreground gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        No incidents in this period
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground font-medium pl-5">Started</TableHead>
                                <TableHead className="text-muted-foreground font-medium">Recovered</TableHead>
                                <TableHead className="text-muted-foreground font-medium">Duration</TableHead>
                                <TableHead className="text-muted-foreground font-medium pr-5">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {incidents.map((inc, i) => (
                                <TableRow key={i} className="border-border hover:bg-accent/50">
                                    <TableCell className="pl-5 text-sm text-foreground font-mono py-3">
                                        {format(inc.start, 'MMM d, HH:mm')}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground font-mono">
                                        {inc.end ? format(inc.end, 'MMM d, HH:mm') : (
                                            <span className="text-red-400">Ongoing</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm font-mono text-muted-foreground">
                                        {formatDistanceStrict(inc.start, inc.end ?? new Date())}
                                    </TableCell>
                                    <TableCell className="pr-5">
                                        <span
                                            className={`text-xs font-medium px-2 py-0.5 rounded border ${inc.end
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}
                                        >
                                            {inc.end ? 'Resolved' : 'Ongoing'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
    )
}