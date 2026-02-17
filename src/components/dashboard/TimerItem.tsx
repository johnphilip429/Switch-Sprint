import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, CheckCircle } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../lib/utils';
import type { ChecklistItem } from '../../types';

interface TimerItemProps {
    item: ChecklistItem;
    onUpdate: (id: string, updates: Partial<ChecklistItem>) => void;
    sessionRunning: boolean;
}

export const TimerItem: React.FC<TimerItemProps> = ({ item, onUpdate, sessionRunning }) => {
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning && sessionRunning) {
            intervalRef.current = window.setInterval(() => {
                onUpdate(item.id, { timeSpentSeconds: item.timeSpentSeconds + 1 });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, sessionRunning, item.id, item.timeSpentSeconds]);

    const toggleTimer = () => {
        if (!sessionRunning) return; // Can't time if session not started? Or maybe auto-start session?
        // Requirement: "If session is running, user can time any item"
        setIsRunning(!isRunning);
    };

    const toggleComplete = () => {
        onUpdate(item.id, { completed: !item.completed });
        if (isRunning) setIsRunning(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs.toString().padStart(2, '0')}s`;
    };

    const progress = Math.min(100, (item.timeSpentSeconds / (item.defaultTimeMinutes * 60)) * 100);

    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg mb-3 transition-all",
            item.completed ? "bg-slate-50 border-slate-100 dark:bg-slate-900/50 dark:border-slate-800" : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm",
            isRunning && "ring-1 ring-indigo-500 border-indigo-500"
        )}>
            <div className="flex items-center gap-3 flex-1">
                <button
                    onClick={toggleComplete}
                    className={cn("flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        item.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-600 hover:border-emerald-400"
                    )}
                >
                    {item.completed && <CheckCircle size={14} />}
                </button>
                <div>
                    <h3 className={cn("font-medium", item.completed && "text-slate-400 line-through")}>{item.label}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-mono">{formatTime(item.timeSpentSeconds)}</span>
                        <span>/ {item.defaultTimeMinutes}m target</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full max-w-[200px] h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all duration-1000",
                                item.completed ? "bg-emerald-500" : isRunning ? "bg-indigo-500" : "bg-indigo-300 dark:bg-indigo-700"
                            )}
                            style={{ width: `${item.completed ? 100 : progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-3 sm:mt-0 flex items-center gap-2">
                {isRunning ? (
                    <Button size="sm" variant="outline" onClick={toggleTimer} className="text-amber-600 border-amber-200 hover:bg-amber-50">
                        <Pause size={16} className="mr-1" /> Pause
                    </Button>
                ) : (
                    <Button size="sm" variant="outline" onClick={toggleTimer} disabled={!sessionRunning || item.completed}
                        className={cn(!sessionRunning && "opacity-50 cursor-not-allowed")}
                    >
                        <Play size={16} className="mr-1" /> Start
                    </Button>
                )}
            </div>
        </div>
    );
};
