import React, { useMemo } from 'react';
import { useAppStore } from '../context/AppContext';
import { Card, Button, Badge } from '../components/ui';
import { TimerItem } from '../components/dashboard/TimerItem';
import { WrapUpModal } from '../components/dashboard/WrapUpModal';
import { SessionHistoryModal } from '../components/dashboard/SessionHistoryModal';
import { Play, Calendar, Clock, Award, Save } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export const Dashboard: React.FC = () => {
    const { activeSession, startSession, updateChecklistItem, state, advanceStudyDay } = useAppStore();
    const [isWrapUpOpen, setIsWrapUpOpen] = React.useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);

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
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Focus Time Card */}
                <Card className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-none shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2">
                        <Clock size={64} />
                    </div>
                    <p className="text-indigo-100 font-medium text-sm z-10 relative">Today's Focus</p>
                    <h2 className="text-4xl font-bold mt-1 z-10 relative">{formatTotalTime(totalTimeToday)}</h2>
                    <div className="flex items-center gap-2 mt-3 z-10 relative">
                        {isSessionRunning ? (
                            <Badge className="bg-white/20 text-white border-0 animate-pulse">Session Active</Badge>
                        ) : (
                            <Badge className="bg-black/20 text-white/80 border-0">Not Started</Badge>
                        )}
                    </div>
                </Card>

                {/* Applications Today Card */}
                <Card className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-none shadow-lg shadow-emerald-200 dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2">
                        <Award size={64} />
                    </div>
                    <p className="text-emerald-100 font-medium text-sm z-10 relative">Applications Today</p>
                    <h2 className="text-4xl font-bold mt-1 z-10 relative">
                        {state.applications.filter(a => a.dateApplied === new Date().toISOString().split('T')[0]).length}
                    </h2>
                    <p className="text-emerald-100 text-xs mt-3 z-10 relative">Keep applying!</p>
                </Card>

                {/* Checklist Progress Card */}
                <Card className="p-6 bg-gradient-to-br from-violet-600 to-violet-700 text-white border-none shadow-lg shadow-violet-200 dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2">
                        <Award size={64} />
                    </div>
                    <p className="text-violet-100 font-medium text-sm z-10 relative">Daily Goals</p>
                    <h2 className="text-4xl font-bold mt-1 z-10 relative">{progressPercentage}%</h2>
                    <div className="w-full bg-black/20 h-2 rounded-full mt-3 overflow-hidden z-10 relative">
                        <div className="bg-white/90 h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="flex flex-col justify-center p-6 border-l-4 border-l-indigo-500">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Session Control</span>
                        <Calendar size={18} className="text-indigo-500" />
                    </div>
                    {isSessionRunning ? (
                        <Button variant="danger" size="lg" onClick={() => setIsWrapUpOpen(true)} className="w-full mt-2 font-bold">
                            <Save size={18} className="mr-2 fill-current" /> Wrap + Update Tracker
                        </Button>
                    ) : !activeSession?.sessionEnd ? (
                        <Button variant="primary" size="lg" onClick={startSession} className="w-full mt-2 shadow-lg shadow-indigo-200 dark:shadow-none font-bold">
                            <Play size={18} className="mr-2 fill-current" /> Start Session
                        </Button>
                    ) : null}

                    {!isSessionRunning && activeSession?.sessionEnd && (
                        progressPercentage === 100 ? (
                            <Button variant="outline" size="lg" onClick={startSession} className="w-full mt-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/50 font-bold">
                                <Play size={18} className="mr-2 fill-current" /> Start Bonus Session
                            </Button>
                        ) : (
                            <div className="w-full mt-2 text-center">
                                <p className="text-xs text-red-500 mb-1 font-bold">Complete all tasks to unlock bonus session</p>
                                <Button variant="outline" size="lg" onClick={startSession} className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-900/50 font-bold opacity-50 cursor-not-allowed" disabled>
                                    <Play size={18} className="mr-2 fill-current" /> Resume Session
                                </Button>
                                {/* Option: Allow them to resume to finish tasks? User said "start second" after finishing. 
                                    If they need to FINISH tasks, they need to RESUME the first one. 
                                    So we should allow RESUME but maybe label it differently or check requirements.
                                    "I can start second session which I can do only after completing all... tasks"
                                    Implies:
                                    1. First session -> Finish tasks -> End Session.
                                    2. Tasks 100% -> Start Second Session.
                                    If tasks NOT 100% -> Can I resume? Yes, I must resume to finish them.
                                    So the button should be "Resume Session" if not done?
                                    Wait, if I ENDED the session, I need to RESUME it to finish tasks.
                                    So:
                                    - Checklist < 100%: Button = "Resume to Finish Tasks"
                                    - Checklist = 100%: Button = "Start Bonus Session"
                                */}
                            </div>
                        )
                    )}

                    {!isSessionRunning && activeSession?.sessionEnd && progressPercentage < 100 && (
                        <Button variant="outline" size="sm" onClick={startSession} className="w-full mt-1 text-slate-500 border-slate-200 hover:bg-slate-100 font-medium">
                            Resume to Finish Tasks
                        </Button>
                    )}
                </Card>

                <Card className="flex flex-col p-6 border-l-4 border-l-pink-500">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">14-Day Plan</span>
                        <Badge variant="success">Day {currentStudyDay}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Keep the streak!</p>
                            <p className="text-xs text-slate-500 mt-1">Consistency is key.</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                        <div className="bg-pink-500 h-full" style={{ width: `${(currentStudyDay / 14) * 100}%` }} />
                    </div>
                </Card>
            </div>

            {/* Checklist Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold">Daily Checklist</h2>
                        <Badge variant="default" className="text-indigo-600 bg-indigo-50 border border-indigo-200">Study Day {state.focusedStudyDay}</Badge>
                    </div>
                    <div className="flex gap-2">
                        <div className="text-sm text-slate-500 flex items-center mr-4">{progressPercentage}% Complete</div>
                        <Button variant="ghost" size="sm" onClick={() => setIsHistoryOpen(true)}>
                            <Clock size={16} className="mr-1" /> History
                        </Button>
                    </div>
                </div>

                {activeSession ? (
                    <div className="space-y-4">
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

                        {/* Advance Study Day Button */}
                        {progressPercentage >= 100 && (
                            <div className="flex justify-center mt-6 animate-fade-in">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none font-bold px-8 py-6 rounded-2xl"
                                    onClick={() => {
                                        if (confirm(`Great job! Ready to start Study Day ${state.focusedStudyDay + 1}? This will reset your study checklist ticks.`)) {
                                            advanceStudyDay();
                                        }
                                    }}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 text-lg">
                                            <span>Start Day {state.focusedStudyDay + 1} Content</span>
                                            <Play size={20} fill="currentColor" />
                                        </div>
                                        <span className="text-xs font-normal opacity-80 mt-1">Keep the momentum going!</span>
                                    </div>
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500">Start a session to see your checklist.</p>
                        <Button onClick={startSession} variant="primary" className="mt-4">Start Now</Button>
                    </div>
                )}
            </div>
            <WrapUpModal isOpen={isWrapUpOpen} onClose={() => setIsWrapUpOpen(false)} />
            <SessionHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </div>
    );
};
