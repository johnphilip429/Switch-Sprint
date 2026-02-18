import React from 'react';
import { cn } from '../../lib/utils';
import { } from 'lucide-react';

interface WindowFrameProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    onClose?: () => void; // Visual only for now, or back navigation
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ title, children, className }) => {
    return (
        <div className={cn("flex flex-col h-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden transition-all duration-300 ring-1 ring-black/5 dark:ring-white/5", className)}>
            {/* Window Header (Title Bar) */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md h-10 md:h-12 flex items-center justify-center px-4 md:px-6 relative flex-shrink-0 border-b border-white/10 select-none">
                {/* Title */}
                <div className="font-bold text-slate-900 dark:text-white text-sm md:text-base flex items-center gap-2 shadow-sm">
                    {title}
                </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-auto relative custom-scrollbar">
                {children}
            </div>
        </div>
    );
};
