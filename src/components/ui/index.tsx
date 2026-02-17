import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6", className)}>
        {children}
    </div>
);

export const Button = ({ className, variant = 'primary', size = 'md', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success', size?: 'sm' | 'md' | 'lg' }) => {
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100",
        outline: "border border-slate-200 bg-transparent hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900",
        ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800",
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-emerald-600 text-white hover:bg-emerald-700",
    };

    const sizes = {
        sm: "px-2 py-1 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            className={cn("inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none", variants[variant], sizes[size], className)}
            {...props}
        />
    );
};

export const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error', className?: string }) => {
    const variants = {
        default: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
        success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
        <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", variants[variant], className)}>
            {children}
        </span>
    );
};
