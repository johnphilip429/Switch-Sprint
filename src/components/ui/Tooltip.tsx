import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
    className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, className }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative flex flex-col items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {isVisible && (
                <div className={cn(
                    "absolute -top-10 px-2 py-1 bg-black/80 text-white text-xs rounded-md whitespace-nowrap backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 z-50",
                    className
                )}>
                    {content}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
                </div>
            )}
            {children}
        </div>
    );
};
