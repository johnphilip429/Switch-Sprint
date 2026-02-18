import React from 'react';
import { useAppStore } from '../context/AppContext';
import { Card, Button, Badge } from '../components/ui';
import { downloadFile } from '../lib/download';
import { BookOpen, Code, Terminal, CheckCircle, Circle, Calendar, Download, Upload, Bell, Lock } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { cn } from '../lib/utils';
import type { StudyDay } from '../types';

export const StudyPlan: React.FC = () => {
    const { state, setStudyPlanStartDate, updateStudyDay, loadStudyPlan } = useAppStore();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleStartPlan = () => {
        setStudyPlanStartDate(new Date().toISOString());
    };

    const today = new Date();
    const startDate = state.studyPlanStartDate ? new Date(state.studyPlanStartDate) : null;
    const currentDayNum = startDate ? Math.max(1, differenceInDays(today, startDate) + 1) : 0;

    const toggleDayComplete = (day: StudyDay) => {
        const isCompleting = !day.completed;
        updateStudyDay(day.dayNumber, {
            completed: isCompleting,
            completedDate: isCompleting ? format(new Date(), 'yyyy-MM-dd') : undefined
        });
    };

    const handleExport = () => {
        const completedDays = (Object.values(state.studyProgress) as StudyDay[]).filter((d: StudyDay) => d.completed);
        const report = `SwitchSprint Study Report
Generated on: ${new Date().toLocaleDateString()}

Total Days Completed: ${completedDays.length} / 14

Completed Modules:
${completedDays.map((d: StudyDay) => `
Day ${d.dayNumber}:
- SQL: ${d.topicSQL}
- Python: ${d.topicPython}
- Spark: ${d.topicSpark}
- Custom Topics: ${d.customTopics?.join(', ') || 'None'}
`).join('')}
`;
        downloadFile(report, 'study-plan-report.txt', 'text/plain');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const newPlan = JSON.parse(content);
                if (Array.isArray(newPlan)) {
                    loadStudyPlan(newPlan);
                    alert('New study plan loaded successfully!');
                } else {
                    alert('Invalid file format. Expected an array of StudyDay objects.');
                }
            } catch (err) {
                alert('Failed to parse file.');
            }
        };
        reader.readAsText(file);
    };

    const handleGoogleCalendarReminder = () => {
        const title = encodeURIComponent("Switch Sprint: Daily Study Session");
        const details = encodeURIComponent("Time to focus on your career switch! Check the Switch Sprint app.");
        // Recurring daily at 9:30 PM (21:30)
        // Format dates as YYYYMMDDTHHMMSSZ.
        const start = new Date();
        start.setHours(21, 30, 0, 0);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

        const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${formatDate(start)}/${formatDate(end)}&recur=RRULE:FREQ=DAILY`;

        window.open(url, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">14-Day Study Plan</h1>
                    <p className="text-slate-500">Structured revision for SQL, Python, and Spark.</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".json"
                    />
                    <Button variant="outline" onClick={handleImportClick}>
                        <Upload size={16} className="mr-2" /> Import Plan
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download size={16} className="mr-2" /> Export Report
                    </Button>
                    {!startDate ? (
                        <div className="flex gap-2">
                            <Button onClick={handleGoogleCalendarReminder} variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                <Bell size={16} className="mr-2" /> Set 9:30 PM Reminder
                            </Button>
                            <Button onClick={handleStartPlan} className="bg-indigo-600 hover:bg-indigo-700">
                                <Calendar className="mr-2" size={18} /> Start Plan Today
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button onClick={handleGoogleCalendarReminder} variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                <Bell size={16} className="mr-2" /> Daily Reminder
                            </Button>
                            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg">
                                <Calendar size={18} />
                                <span className="font-medium">Current: Day {Math.min(14, currentDayNum)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-6">
                {(Object.values(state.studyProgress) as StudyDay[]).map((day: StudyDay) => {
                    const isToday = day.dayNumber === currentDayNum;
                    const date = startDate ? addDays(startDate, day.dayNumber - 1) : null;

                    // Locking Logic: Locked if previous day is NOT completed (except Day 1)
                    // const isLocked = startDate && day.dayNumber > currentDayNum; // OLD logic based on date
                    const previousDay = state.studyProgress[day.dayNumber - 1];
                    const isLocked = day.dayNumber > 1 && !previousDay?.completed;

                    return (
                        <Card
                            key={day.dayNumber}
                            className={cn(
                                "transition-all border-l-4",
                                day.completed ? "border-l-emerald-500 bg-slate-50 dark:bg-slate-900/50" :
                                    isToday ? "border-l-indigo-500 ring-1 ring-indigo-500 shadow-md" : "border-l-slate-200 dark:border-l-slate-800",
                                isLocked && "opacity-60 grayscale-[0.5]"
                            )}
                        >
                            <div className="flex flex-col md:flex-row gap-6 relative">
                                {isLocked && (
                                    <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
                                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full shadow-lg">
                                            <Lock className="text-slate-400" size={24} />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-shrink-0 min-w-[120px]">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Day {day.dayNumber}</h3>
                                    {date && <p className="text-sm text-slate-500">{format(date, 'MMM d, yyyy')}</p>}
                                    <div className="mt-2">
                                        {day.completed ? (
                                            <Badge variant="success" className="flex w-fit items-center gap-1"><CheckCircle size={12} /> Completed</Badge>
                                        ) : isToday ? (
                                            <Badge variant="warning" className="flex w-fit items-center gap-1"><Circle size={12} /> In Progress</Badge>
                                        ) : (
                                            <Badge className="bg-slate-100 text-slate-500">Pending</Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
                                            <Terminal size={16} /> SQL
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{day.topicSQL}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                                            <Code size={16} /> Python
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{day.topicPython}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-medium">
                                            <BookOpen size={16} /> Spark
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{day.topicSpark}</p>
                                    </div>

                                    <div className="md:col-span-3 mt-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Practice Task</span>
                                        <p className="text-sm mt-1 font-medium">{day.practiceTask}</p>
                                    </div>

                                    {/* Custom Topics Area */}
                                    <div className="md:col-span-3 mt-2">
                                        <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">My Extra Topics</p>
                                        <div className="space-y-2">
                                            {day.customTopics?.map((topic, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded text-sm">
                                                    <span>{topic}</span>
                                                    <button
                                                        onClick={() => {
                                                            const newTopics = day.customTopics?.filter((_, i) => i !== idx);
                                                            updateStudyDay(day.dayNumber, { customTopics: newTopics });
                                                        }}
                                                        className="text-slate-400 hover:text-red-500"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="flex gap-2">
                                                <input
                                                    placeholder="Add extra topic you covered..."
                                                    className="flex-1 text-sm border rounded px-2 py-1 dark:bg-slate-950 dark:border-slate-800"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const val = e.currentTarget.value.trim();
                                                            if (val) {
                                                                const newTopics = [...(day.customTopics || []), val];
                                                                updateStudyDay(day.dayNumber, { customTopics: newTopics });
                                                                e.currentTarget.value = '';
                                                            }
                                                        }
                                                    }}
                                                />
                                                <Button size="sm" variant="secondary" onClick={(e) => {
                                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                    const val = input.value.trim();
                                                    if (val) {
                                                        const newTopics = [...(day.customTopics || []), val];
                                                        updateStudyDay(day.dayNumber, { customTopics: newTopics });
                                                        input.value = '';
                                                    }
                                                }}>+</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end md:justify-center">
                                    <Button
                                        variant={day.completed ? "outline" : "primary"}
                                        onClick={() => toggleDayComplete(day)}
                                        disabled={isLocked}
                                    >
                                        {day.completed ? "Mark Incomplete" : "Mark Done"}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
