import React, { useMemo } from 'react';
import { useAppStore } from '../context/AppContext';
import { Card, Button, Badge } from '../components/ui';
import { TimerItem } from '../components/dashboard/TimerItem';
import { Play, Square, Calendar, Clock, Award } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export const Dashboard: React.FC = () => {
    const { activeSession, startSession, endSession, updateChecklistItem, state } = useAppStore();

    const isSessionRunning = !!activeSession?.sessionStart && !activeSession?.sessionEnd;

    const totalTimeToday = activeSession ? activeSession.totalTimeSpentSeconds : 0;

    const formatTotalTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${hrs}h ${mins}m`;
    };

    const progressPercentage = useMemo(() => {
        if (!activeSession) return 0;
        const completed = activeSession.checklist.filter(i => i.completed).length;
        return Math.round((completed / activeSession.checklist.length) * 100);
    }, [activeSession]);

    const currentStudyDay = useMemo(() => {
        if (!state.studyPlanStartDate) return 1;
        const start = new Date(state.studyPlanStartDate);
        const diff = differenceInDays(new Date(), start);
        return Math.max(1, Math.min(14, diff + 1));
    }, [state.studyPlanStartDate]);

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="flex items-center justify-between p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
                    <div>
                        <p className="text-indigo-100 font-medium text-sm">Today's Focus</p>
                        <h2 className="text-3xl font-bold mt-1">{formatTotalTime(totalTimeToday)}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            {isSessionRunning ? (
                                <Badge className="bg-white/20 text-white border-0 animate-pulse">Session Active</Badge>
                            ) : (
                                <Badge className="bg-black/20 text-white/80 border-0">Not Started</Badge>
                            )}
                        </div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-full">
                        <Clock size={32} />
                    </div>
                </Card>

                <Card className="flex flex-col justify-center p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-sm font-medium">Session Control</span>
                        <Calendar size={18} className="text-slate-400" />
                    </div>
                    {isSessionRunning ? (
                        <Button variant="danger" size="lg" onClick={endSession} className="w-full mt-2">
                            <Square size={18} className="mr-2 fill-current" /> End Session
                        </Button>
                    ) : (
                        <Button variant="primary" size="lg" onClick={startSession} className="w-full mt-2 shadow-lg shadow-indigo-200 dark:shadow-none">
                            <Play size={18} className="mr-2 fill-current" /> Start Session
                        </Button>
                    )}
                    {!isSessionRunning && activeSession?.sessionEnd && (
                        <p className="text-xs text-center text-slate-500 mt-2">Session finished for today!</p>
                    )}
                </Card>

                <Card className="flex flex-col p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-500 text-sm font-medium">14-Day Plan</span>
                        <Badge variant="success">Day {currentStudyDay}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Keep the streak!</p>
                            <p className="text-xs text-slate-500 mt-1">Consistency is key.</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${(currentStudyDay / 14) * 100}%` }} />
                    </div>
                </Card>
            </div>

            {/* Checklist Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Daily Checklist</h2>
                    <span className="text-sm text-slate-500">{progressPercentage}% Complete</span>
                </div>

                {activeSession ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeSession.checklist.map(item => (
                            <TimerItem
                                key={item.id}
                                item={item}
                                onUpdate={updateChecklistItem}
                                sessionRunning={isSessionRunning}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500">Start a session to see your checklist.</p>
                        <Button onClick={startSession} variant="primary" className="mt-4">Start Now</Button>
                    </div>
                )}
            </div>
        </div>
    );
};
