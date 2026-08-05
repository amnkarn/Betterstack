import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { addWebsite } from '@/api/homeApi';
import { Button } from './ui/Button';

interface AddMonitorModalProps {
    open: boolean;
    onClose: () => void;
    refresh: () => void
}

const intervalOptions = [
    { label: '1 minute', value: 60 },
    { label: '3 minutes', value: 180 },
    { label: '10 minutes', value: 600 },
    { label: '15 minutes', value: 900 },
    { label: '30 minutes', value: 1800 },
    { label: '1 hour', value: 3600 },
];

export default function AddMonitorModal({ open, onClose, refresh }: AddMonitorModalProps) {
    const [url, setUrl] = useState('');
    const [interval, setInterval] = useState(60);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !interval) return;

        setLoading(true);
        await addWebsite(url);
        setLoading(false);
        //refresh
        refresh();
        // Reset form
        setUrl('');
        setInterval(60);
        setLoading(false);
        onClose();
    };

    return (
        <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
            <AlertDialogContent className="bg-card border-border text-foreground max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>Add New Monitor</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        Monitor a website or API endpoint for uptime and performance.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">URL</label>
                        <Input
                            type="url"
                            placeholder="https://api.example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Check Interval</label>
                        <div className="grid grid-cols-4 gap-2">
                            {intervalOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setInterval(option.value)}
                                    className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                                        interval === option.value
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <Button
                            className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Monitor'}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
