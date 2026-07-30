import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
    children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

interface DropdownMenuContentProps {
    children: React.ReactNode;
    align?: 'start' | 'center' | 'end';
    className?: string;
}

interface DropdownMenuItemProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

interface DropdownMenuSeparatorProps {
    className?: string;
}

const DropdownMenuContext = React.createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

export function DropdownMenu({ children }: DropdownMenuProps) {
    const [open, setOpen] = useState(false);
    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-block">{children}</div>
        </DropdownMenuContext.Provider>
    );
}

export function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps) {
    const { open, setOpen } = React.useContext(DropdownMenuContext);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, setOpen]);

    if (asChild) {
        return React.cloneElement(children as React.ReactElement, {
            onClick: () => setOpen(!open),
            ref: triggerRef,
        });
    }

    return (
        <div ref={triggerRef} onClick={() => setOpen(!open)}>
            {children}
        </div>
    );
}

export function DropdownMenuContent({ children, align = 'end', className = '' }: DropdownMenuContentProps) {
    const { open } = React.useContext(DropdownMenuContext);

    if (!open) return null;

    const alignClasses = {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0',
    };

    return (
        <div
            className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${alignClasses[align]} ${className}`}
        >
            {children}
        </div>
    );
}

export function DropdownMenuItem({ children, className = '', onClick }: DropdownMenuItemProps) {
    const { setOpen } = React.useContext(DropdownMenuContext);

    return (
        <div
            className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${className}`}
            onClick={() => {
                onClick?.();
                setOpen(false);
            }}
        >
            {children}
        </div>
    );
}

export function DropdownMenuSeparator({ className = '' }: DropdownMenuSeparatorProps) {
    return <div className={`my-1 h-px w-full bg-border ${className}`} />;
}
