import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/ui';
import { INTERVIEW_QUESTIONS, type QuestionCategory } from '../data/questions';
import { Timer, Eye, ChevronRight, CheckCircle2 } from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';

export const MockInterview: React.FC = () => {
    const [category, setCategory] = useState<QuestionCategory | 'All'>('All');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
    const [isStarted, setIsStarted] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question default
    const [timerActive, setTimerActive] = useState(false);

    const filteredQuestions = category === 'All'
        ? INTERVIEW_QUESTIONS
        : INTERVIEW_QUESTIONS.filter(q => q.category === category);

    const getRandomQuestion = () => {
        const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
        setCurrentQuestionIndex(randomIndex);
        setIsStarted(true);
        setShowHint(false);
        setShowAnswer(false);
        setTimeLeft(120);
        setTimerActive(true);
    };

    useEffect(() => {
        let interval: number;
        if (timerActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = currentQuestionIndex !== null ? filteredQuestions[currentQuestionIndex] : null;

    return (
        <WindowFrame title="The Dojo" className="h-full">
            <div className="space-y-6 max-w-2xl mx-auto p-1">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Mock Interview Mode</h1>
                    <p className="text-slate-500">Practice speaking out loud. Simulate the pressure.</p>
                </div>

                {!isStarted ? (
                    <Card className="p-8 text-center space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">Ready to start?</h2>
                            <p className="text-sm text-slate-500">Select a topic to focus on.</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {(['All', 'SQL', 'Python', 'Behavioral'] as const).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <Button size="lg" onClick={getRandomQuestion} className="w-full max-w-xs mx-auto">
                            Start Session <ChevronRight className="ml-2" size={18} />
                        </Button>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Free Study Resources</p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <a href="https://sqlzoo.net/" target="_blank" rel="noreferrer" className="flex items-center justify-center p-2 rounded bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    🐘 SQLZoo
                                </a>
                                <a href="https://realpython.com/" target="_blank" rel="noreferrer" className="flex items-center justify-center p-2 rounded bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    🐍 RealPython
                                </a>
                                <a href="https://www.pramp.com/" target="_blank" rel="noreferrer" className="flex items-center justify-center p-2 rounded bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    👥 Pramp (Mock)
                                </a>
                                <a href="https://leetcode.com/problemset/database/" target="_blank" rel="noreferrer" className="flex items-center justify-center p-2 rounded bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    💻 LeetCode SQL
                                </a>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <Button variant="ghost" onClick={() => setIsStarted(false)}>End Session</Button>
                            <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-slate-700 dark:text-slate-300'}`}>
                                <Timer size={24} />
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <Card className="p-8 min-h-[300px] flex flex-col justify-center items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="text-9xl font-black">{category === 'All' ? '?' : category[0]}</span>
                            </div>

                            <span className="mb-4 inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider">
                                {currentQuestion?.category}
                            </span>

                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 leading-tight">
                                {currentQuestion?.question}
                            </h2>

                            <div className="space-y-4 w-full max-w-md">
                                {showHint && (
                                    <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-4 rounded-lg text-sm animate-in fade-in">
                                        💡 <strong>Hint:</strong> {currentQuestion?.hint}
                                    </div>
                                )}

                                {showAnswer && currentQuestion?.answer && (
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 p-4 rounded-lg text-sm text-left animate-in fade-in">
                                        ✅ <strong>Answer Key:</strong> {currentQuestion?.answer}
                                    </div>
                                )}
                            </div>
                        </Card>

                        <div className="flex justify-center gap-3">
                            {!showHint && (
                                <Button variant="outline" onClick={() => setShowHint(true)}>
                                    <Eye size={16} className="mr-2" /> Show Hint
                                </Button>
                            )}
                            {!showAnswer && currentQuestion?.answer && (
                                <Button variant="outline" onClick={() => setShowAnswer(true)}>
                                    <CheckCircle2 size={16} className="mr-2" /> Reveal Answer
                                </Button>
                            )}
                            <Button onClick={getRandomQuestion}>
                                Next Question <ChevronRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </WindowFrame>
    );
};
