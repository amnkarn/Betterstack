import { Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import type React from "react";

interface DeleteModalType {
    deleteTargetId: string | null,
    setDeleteTargetId: React.Dispatch<React.SetStateAction<string | null>>
    onClick: () => void,
    deleting: boolean
}

export default function DeleteModal({
    deleteTargetId,
    setDeleteTargetId,
    onClick,
    deleting,
}: DeleteModalType
) {


    return (
        <AlertDialog open={!!deleteTargetId}
            onOpenChange={(o) => !o && setDeleteTargetId(null)}>
            <AlertDialogContent className="bg-card border-border text-foreground">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete monitor?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        This will permanently delete{' '}
                        <span className="text-foreground font-medium">{deleteTargetId}</span>
                        {' '}and all its data. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0"
                        onClick={onClick}
                        disabled={deleting}
                    >
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    );
}