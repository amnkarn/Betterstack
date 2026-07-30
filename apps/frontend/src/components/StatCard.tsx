interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
}

export default function StatCard({
    label,
    value,
    icon: Icon,
    color,
}: StatCardProps) {
    return (
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
                <p className="text-white text-2xl font-bold leading-none">{value}</p>
            </div>
        </div>
    );
}
