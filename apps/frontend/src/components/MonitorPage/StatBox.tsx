

export default function StatBox({
    label,
    value,
    sub,
    tone,
}: {
    label: string;
    value: string;
    sub?: string;
    tone?: 'green' | 'red' | 'neutral';
}) {
    const valueColor =
        tone === 'green'
            ? 'text-emerald-400'
            : tone === 'red'
                ? 'text-red-400'
                : 'text-foreground';

    return (
        <div className="bg-card border border-border rounded-lg px-5 py-4">
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
                {label}
            </p>
            <p className={`text-2xl font-bold font-mono leading-none ${valueColor}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
        </div>
    );
}