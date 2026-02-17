import React from 'react';
import { useAppStore } from '../context/AppContext';
import { Card } from '../components/ui';
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

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Analytics</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Total Sessions</p>
                        <h3 className="text-2xl font-bold">{totalSessions}</h3>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Study Hours</p>
                        <h3 className="text-2xl font-bold">{totalHours}h</h3>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Applications</p>
                        <h3 className="text-2xl font-bold">{totalApps}</h3>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-violet-100 text-violet-600 rounded-full">
                        <Zap size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Useful Days</p>
                        <h3 className="text-2xl font-bold">{activeStreak}</h3>
                    </div>
                </Card>
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
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {state.sessions.slice(-5).reverse().map(session => (
                            <div key={session.date} className="flex items-center justify-between border-b pb-2 last:border-0">
                                <div>
                                    <p className="font-medium">{session.date}</p>
                                    <p className="text-xs text-slate-500">
                                        {Math.round(session.totalTimeSpentSeconds / 60)} mins studied
                                    </p>
                                </div>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                                    {session.checklist.filter(i => i.completed).length} items done
                                </span>
                            </div>
                        ))}
                        {state.sessions.length === 0 && <p className="text-slate-500 text-center py-4">No sessions recorded.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};
