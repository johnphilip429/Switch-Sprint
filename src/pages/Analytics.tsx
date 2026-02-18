import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Card } from '../components/ui';
import { WindowFrame } from '../components/layout/WindowFrame';
import { BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react';
import type { DailySession, JobApplication } from '../types';

export const Analytics: React.FC = () => {
    const { state } = useAppStore();

    const totalSessions = state.sessions.length;
    const totalHours = Math.round(state.sessions.reduce((acc: number, s: DailySession) => acc + s.totalTimeSpentSeconds, 0) / 3600);
    const totalApps = state.applications.length;
    const activeStreak = state.sessions.filter((s: DailySession) => s.totalTimeSpentSeconds > 1800).length; // simple logic for now

    const statusCounts = state.applications.reduce((acc: Record<string, number>, app: JobApplication) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const [expandedSession, setExpandedSession] = useState<string | null>(null);

    const toggleSession = (date: string) => {
        if (expandedSession === date) {
            setExpandedSession(null);
        } else {
            setExpandedSession(date);
        }
    };

    return (
        <WindowFrame title="Quantified Self" className="h-full">
            <div className="space-y-6 p-1">
                <h1 className="text-2xl font-bold">Analytics</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-5 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-none shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Calendar size={20} className="text-white" />
                            </div>
                            <p className="text-xs font-medium text-indigo-100 uppercase tracking-wider">Total Days</p>
                        </div>
                        <h3 className="text-3xl font-bold">{totalSessions}</h3>
                    </Card>

                    <Card className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-none shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <TrendingUp size={20} className="text-white" />
                            </div>
                            <p className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Study Hours</p>
                        </div>
                        <h3 className="text-3xl font-bold">{totalHours}h</h3>
                    </Card>

                    <Card className="p-5 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <BarChart3 size={20} className="text-white" />
                            </div>
                            <p className="text-xs font-medium text-amber-100 uppercase tracking-wider">Applications</p>
                        </div>
                        <h3 className="text-3xl font-bold">{totalApps}</h3>
                    </Card>

                    <Card className="p-5 bg-gradient-to-br from-violet-500 to-violet-700 text-white border-none shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Zap size={20} className="text-white" />
                            </div>
                            <p className="text-xs font-medium text-violet-100 uppercase tracking-wider">Useful Days</p>
                        </div>
                        <h3 className="text-3xl font-bold">{activeStreak}</h3>
                    </Card>
                </div>

                {/* Quote of the Moment */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    <p className="text-lg md:text-xl font-medium italic opacity-90">"Success is the sum of small efforts, repeated day in and day out."</p>
                    <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-bold">- Robert Collier</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <h3 className="font-bold mb-4">Application Funnel</h3>
                        <div className="space-y-4">
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <div key={status}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{status}</span>
                                        <span className="font-medium">{count}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full" style={{ width: `${(count / totalApps) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                            {totalApps === 0 && <p className="text-slate-500 text-center py-4">No data yet.</p>}
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold mb-4">Recent Activity</h3>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                            {state.sessions.slice(-7).reverse().map(session => (
                                <div
                                    key={session.date}
                                    onClick={() => toggleSession(session.date)}
                                    className="border border-slate-100 dark:border-slate-800 rounded-lg p-3 hover:shadow-sm bg-white dark:bg-slate-900/50 transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-full ${expandedSession === session.date ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                <Calendar size={16} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{session.date}</h4>
                                                <p className="text-xs text-slate-500">
                                                    {Math.round(session.totalTimeSpentSeconds / 60)} mins studied
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold font-mono bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
                                            {session.checklist.filter(i => i.completed).length} items
                                        </span>
                                    </div>

                                    {expandedSession === session.date && (
                                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
                                            {/* Session Notes */}
                                            {session.notes && (
                                                <div className="mb-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded italic border border-slate-100 dark:border-slate-800">
                                                    "{session.notes}"
                                                </div>
                                            )}

                                            {/* Topics / Checklist */}
                                            {(
                                                session.checklist.filter(i => i.completed).length > 0 ||
                                                Object.values(state.studyProgress).some(day =>
                                                    day.completed && day.completedDate?.startsWith(session.date)
                                                )
                                            ) && (
                                                    <div className="mb-2">
                                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Topics Completed</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {session.checklist.filter(i => i.completed).map(item => (
                                                                <span key={item.id} className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800">
                                                                    {item.label}
                                                                </span>
                                                            ))}
                                                            {Object.values(state.studyProgress)
                                                                .filter(day => day.completed && day.completedDate && (
                                                                    day.completedDate === session.date ||
                                                                    day.completedDate.startsWith(session.date) ||
                                                                    day.completedDate.split('T')[0] === session.date
                                                                ))
                                                                .map(day => (
                                                                    <React.Fragment key={day.dayNumber}>
                                                                        <span className="text-xs bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 px-2 py-0.5 rounded border border-violet-100 dark:border-violet-800">
                                                                            Day {day.dayNumber}: {day.topicSQL}
                                                                        </span>
                                                                        <span className="text-xs bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 px-2 py-0.5 rounded border border-violet-100 dark:border-violet-800">
                                                                            Day {day.dayNumber}: {day.topicPython}
                                                                        </span>
                                                                        <span className="text-xs bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 px-2 py-0.5 rounded border border-violet-100 dark:border-violet-800">
                                                                            Day {day.dayNumber}: {day.topicSpark}
                                                                        </span>
                                                                        <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-800">
                                                                            Prac: {day.practiceTask}
                                                                        </span>
                                                                        {day.customTopics?.map((topic, idx) => (
                                                                            <span key={`custom-${day.dayNumber}-${idx}`} className="text-xs bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 px-2 py-0.5 rounded border border-fuchsia-100 dark:border-fuchsia-800">
                                                                                {topic}
                                                                            </span>
                                                                        ))}
                                                                    </React.Fragment>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Applications Applied */}
                                            {state.applications.filter(a => a.dateApplied === session.date).length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Applications Sent</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {state.applications.filter(a => a.dateApplied === session.date).map(app => (
                                                            <span key={app.id} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                                                                {app.company} ({app.roleTitle})
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {(!session.notes && session.checklist.filter(i => i.completed).length === 0 && state.applications.filter(a => a.dateApplied === session.date).length === 0) && (
                                                <p className="text-xs text-slate-400 italic">No detailed activity recorded.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {state.sessions.length === 0 && <p className="text-slate-500 text-center py-4">No sessions recorded.</p>}
                        </div>
                    </Card>
                </div>
            </div>
        </WindowFrame>
    );
};
