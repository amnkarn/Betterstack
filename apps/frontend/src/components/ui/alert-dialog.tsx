import React, { createContext, useContext, useState } from 'react';

interface AlertDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

interface AlertDialogContentProps {
    children: React.ReactNode;
    className?: string;
}

interface AlertDialogHeaderProps {
    children: React.ReactNode;
}

interface AlertDialogTitleProps {
    children: React.ReactNode;
}

interface AlertDialogDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

interface AlertDialogFooterProps {
    children: React.ReactNode;
}

interface AlertDialogActionProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

interface AlertDialogCancelProps {
    children: React.ReactNode;
    className?: string;
}

const AlertDialogContext = createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

export function AlertDialog({ open: controlledOpen, onOpenChange, children }: AlertDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = (value: boolean) => {
        if (onOpenChange) {
            onOpenChange(value);
        } else {
            setInternalOpen(value);
        }
    };

    return (
        <AlertDialogContext.Provider value={{ open, setOpen }}>
            {children}
        </AlertDialogContext.Provider>
    );
}

export function AlertDialogContent({ children, className = '' }: AlertDialogContentProps) {
    const { open, setOpen } = useContext(AlertDialogContext);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                onClick={() => setOpen(false)}
            />
            <div
                className={`relative z-50 w-full max-w-lg rounded-lg border bg-card p-6 shadow-lg ${className}`}
            >
                {children}
            </div>
        </div>
    );
}

export function AlertDialogHeader({ children }: AlertDialogHeaderProps) {
    return <div className="mb-4">{children}</div>;
}

export function AlertDialogTitle({ children }: AlertDialogTitleProps) {
    return <h2 className="text-lg font-semibold text-foreground">{children}</h2>;
}

export function AlertDialogDescription({ children, className = '' }: AlertDialogDescriptionProps) {
    return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}

export function AlertDialogFooter({ children }: AlertDialogFooterProps) {
    return <div className="flex justify-end gap-2 mt-6">{children}</div>;
}

export function AlertDialogAction({ children, className = '', onClick, disabled }: AlertDialogActionProps) {
    const { setOpen } = useContext(AlertDialogContext);
    return (
        <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${className}`}
            onClick={() => {
                onClick?.();
                setOpen(false);
            }}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export function AlertDialogCancel({ children, className = '' }: AlertDialogCancelProps) {
    const { setOpen } = useContext(AlertDialogContext);
    return (
        <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${className}`}
            onClick={() => setOpen(false)}
        >
            {children}
        </button>
    );
}
