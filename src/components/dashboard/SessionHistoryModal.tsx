import React, { useState } from 'react';
import { useAppStore } from '../../context/AppContext';
import { X, Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface SessionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({ isOpen, onClose }) => {
    const { state } = useAppStore();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Sort sessions by date desc
    const sortedSessions = [...state.sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const selectedSession = selectedDate ? sortedSessions.find(s => s.date === selectedDate) : null;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative border border-white/10">
                {/* Header */}
                <div className="h-14 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="text-indigo-500" /> Session History
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar: List of Dates */}
                    <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/30">
                        {sortedSessions.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No sessions recorded yet.</div>
                        ) : (
                            <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                {sortedSessions.map(session => {
                                    const isSelected = session.date === selectedDate;
                                    const completedCount = session.checklist.filter(i => i.completed).length;
                                    const totalCount = session.checklist.length;
                                    const percent = Math.round((completedCount / totalCount) * 100);

                                    return (
                                        <button
                                            key={session.date}
                                            onClick={() => setSelectedDate(session.date)}
                                            className={cn(
                                                "w-full text-left p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex flex-col gap-1",
                                                isSelected && "bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500"
                                            )}
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{format(new Date(session.date), 'EEE, MMM d')}</span>
                                                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", percent === 100 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600")}>
                                                    {percent}%
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><Clock size={12} /> {Math.round(session.totalTimeSpentSeconds / 60)}m</span>
                                                <span>•</span>
                                                <span>{session.applicationsCount} Apps</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Content: Selected Session Details */}
                    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-950">
                        {selectedSession ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">{format(new Date(selectedSession.date), 'EEEE, MMMM do, yyyy')}</h3>
                                    <p className="text-slate-500">Daily Summary</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                                        <div className="text-xs font-bold text-indigo-500 uppercase mb-1">Time Focus</div>
                                        <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                                            {(selectedSession.totalTimeSpentSeconds / 3600).toFixed(1)}h
                                        </div>
                                    </div>
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                                        <div className="text-xs font-bold text-emerald-500 uppercase mb-1">Apps Sent</div>
                                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                            {selectedSession.applicationsCount}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                                        <div className="text-xs font-bold text-amber-500 uppercase mb-1">Msgs Sent</div>
                                        <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                                            {selectedSession.recruiterMessagesCount}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                                        <CheckCircle2 size={18} className="text-slate-400" />
                                        Checklist Log
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedSession.checklist.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                                <div className="flex items-center gap-3">
                                                    {item.completed ? (
                                                        <CheckCircle2 size={20} className="text-emerald-500" />
                                                    ) : (
                                                        <Circle size={20} className="text-slate-300" />
                                                    )}
                                                    <span className={cn(item.completed && "text-slate-400 line-through")}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                                <div className="text-xs font-mono text-slate-400">
                                                    {Math.floor(item.timeSpentSeconds / 60)}m
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedSession.notes && (
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800/30 text-sm italic text-slate-600 dark:text-slate-400">
                                        "{selectedSession.notes}"
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                                <Calendar size={64} className="mb-4" />
                                <p>Select a date to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
