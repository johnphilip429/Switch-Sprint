import React from 'react';
import { useAppStore } from '../../context/AppContext';
import { Button, Badge } from '../ui';
import { X, Download, FileSpreadsheet, FolderInput, CheckCircle, RefreshCcw, AlertTriangle } from 'lucide-react';
import { downloadBackup, downloadExcel } from '../../lib/export';

interface WrapUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WrapUpModal: React.FC<WrapUpModalProps> = ({ isOpen, onClose }) => {
    const {
        state,
        activeSession,
        endSession,
        backupStatus,
        connectBackupFolder,
        lastBackupTime,
        backupFolderName,
        verifyBackupConnection
    } = useAppStore();

    if (!isOpen) return null;

    const todaySession = activeSession;
    const totalTimeToday = todaySession ? Math.round(todaySession.totalTimeSpentSeconds / 60) : 0;
    const tasksCompleted = todaySession ? todaySession.checklist.filter(i => i.completed).length : 0;
    const appsAdded = state.applications.filter(a => a.dateApplied === todaySession?.date).length;

    // Weekly Stats (Approximate from loaded sessions)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklySessions = state.sessions.filter(s => new Date(s.date) >= sevenDaysAgo);
    const weeklyTime = Math.round(weeklySessions.reduce((acc, s) => acc + s.totalTimeSpentSeconds, 0) / 60);
    const weeklyApps = state.applications.filter(a => new Date(a.dateApplied) >= sevenDaysAgo).length;

    // Lifetime Stats
    const lifetimeTime = Math.round(state.sessions.reduce((acc, s) => acc + s.totalTimeSpentSeconds, 0) / 60);
    const lifetimeApps = state.applications.length;

    const handleEndSession = () => {
        if (activeSession) {
            endSession();
            onClose(); // Fix: Close modal after ending session
        }
    };

    // Calculate Topics Covered Today
    const todayDate = new Date().toISOString().split('T')[0];
    const topicsCovered = Object.values(state.studyProgress).filter(day =>
        day.completed && day.completedDate?.startsWith(todayDate)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-indigo-600 p-6 text-white flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold">Great work today!</h2>
                        <p className="text-indigo-100">Here's your summary for the day.</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">

                    {/* Today's Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center">
                            <h3 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{totalTimeToday}m</h3>
                            <p className="text-sm text-slate-500 font-medium">Focused</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center">
                            <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{tasksCompleted}</h3>
                            <p className="text-sm text-slate-500 font-medium">Tasks Done</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center">
                            <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{appsAdded}</h3>
                            <p className="text-sm text-slate-500 font-medium">Applications</p>
                        </div>
                    </div>

                    {/* Topics Covered Section */}
                    {topicsCovered.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                                Topics Covered Today
                            </h3>
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4">
                                {topicsCovered.map(day => (
                                    <div key={day.dayNumber} className="mb-2 last:mb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-emerald-700 dark:text-emerald-400">Day {day.dayNumber}</span>
                                            <Badge variant="success" className="text-xs">Completed</Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                                <span className="font-medium text-slate-500 text-xs uppercase w-12">SQL</span>
                                                {day.topicSQL}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                <span className="font-medium text-slate-500 text-xs uppercase w-12">Python</span>
                                                {day.topicPython}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                <span className="font-medium text-slate-500 text-xs uppercase w-12">Spark</span>
                                                {day.topicSpark}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                                                <span className="font-medium text-slate-500 text-xs uppercase w-12">Task</span>
                                                {day.practiceTask}
                                            </div>
                                            {day.customTopics?.map((t, i) => (
                                                <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                                                    <span className="font-medium text-slate-500 text-xs uppercase w-12">Extra</span>
                                                    {t}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Progress Overview */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                                Weekly & Lifetime
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Weekly</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span>Time</span>
                                            <span className="font-bold">{Math.floor(weeklyTime / 60)}h {weeklyTime % 60}m</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Apps</span>
                                            <span className="font-bold">{weeklyApps}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Lifetime</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span>Time</span>
                                            <span className="font-bold">{Math.floor(lifetimeTime / 60)}h {lifetimeTime % 60}m</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Apps</span>
                                            <span className="font-bold">{lifetimeApps}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Backup Section */}
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                                <RefreshCcw size={20} />
                                Data & Backup
                            </h3>

                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <Button
                                    onClick={() => downloadExcel(state)}
                                    variant="secondary"
                                    className="flex-1 flex justify-center"
                                >
                                    <FileSpreadsheet size={18} className="mr-2" />
                                    Save Report (Excel)
                                </Button>
                                <Button
                                    onClick={() => downloadBackup(state)}
                                    variant="secondary"
                                    className="flex-1 flex justify-center"
                                >
                                    <Download size={18} className="mr-2" />
                                    Download JSON Backup
                                </Button>
                            </div>

                            <div className="pt-4 border-t border-indigo-200 dark:border-indigo-800/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm text-indigo-900 dark:text-indigo-200">Continuous Backup Folder</span>
                                    {backupStatus === 'connected' || backupStatus === 'saved' || backupStatus === 'saving' ? (
                                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0 flex items-center gap-1">
                                            <CheckCircle size={12} /> Connected
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-0">
                                            Not Connected
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                    Connect a folder (like OneDrive) to automatically save your progress continuously.
                                </p>

                                {backupStatus === 'disconnected' ? (
                                    backupFolderName ? (
                                        <div className="flex gap-2 w-full">
                                            <Button onClick={verifyBackupConnection} variant="primary" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                                                <FolderInput size={18} className="mr-2" />
                                                Reconnect "{backupFolderName}"
                                            </Button>
                                            <Button onClick={connectBackupFolder} variant="outline" className="px-3" title="Change Folder">
                                                <RefreshCcw size={18} />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={connectBackupFolder} variant="primary" className="w-full">
                                            <FolderInput size={18} className="mr-2" />
                                            Connect Backup Folder
                                        </Button>
                                    )
                                ) : (
                                    <div className="flex items-center justify-between bg-white dark:bg-slate-950 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                                        <div className="flex items-center gap-2 text-sm">
                                            {backupStatus === 'saving' ? (
                                                <RefreshCcw size={16} className="animate-spin text-indigo-500" />
                                            ) : (
                                                <CheckCircle size={16} className="text-green-500" />
                                            )}
                                            <span className="text-slate-600 dark:text-slate-300">
                                                {backupStatus === 'saving' ? 'Saving...' :
                                                    backupStatus === 'saved' ? `Last saved: ${lastBackupTime?.toLocaleTimeString()}` :
                                                        'Connected'}
                                            </span>
                                        </div>
                                        {backupStatus === 'error' && (
                                            <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                                                <AlertTriangle size={12} /> Error Saving
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3 shrink-0">
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                    {activeSession && (
                        <Button variant="danger" onClick={handleEndSession}>
                            End Session Only
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
