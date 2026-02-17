import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppData, DailySession, JobApplication, StudyDay, ResourceCategory, ChecklistItem } from '../types';
import { DEFAULT_CHECKLIST, DEFAULT_RESOURCES, STUDY_PLAN } from '../data/seed';
import { format } from 'date-fns';

interface AppContextType {
    state: AppData;
    startSession: () => void;
    endSession: () => void;
    updateChecklistItem: (itemId: string, updates: Partial<ChecklistItem>) => void;
    addApplication: (app: JobApplication) => void;
    updateApplication: (appId: string, updates: Partial<JobApplication>) => void;
    deleteApplication: (appId: string) => void;
    updateStudyDay: (dayNumber: number, updates: Partial<StudyDay>) => void;
    setStudyPlanStartDate: (date: string) => void;
    loadStudyPlan: (newPlan: StudyDay[]) => void;
    updateResources: (resources: ResourceCategory[]) => void;
    activeSession: DailySession | null;
    todaySession: DailySession | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'switch-sprint-data-v1';

const INITIAL_STATE: AppData = {
    sessions: [],
    applications: [],
    studyPlanStartDate: null,
    studyProgress: STUDY_PLAN.reduce((acc, day) => ({ ...acc, [day.dayNumber]: day }), {}),
    resources: DEFAULT_RESOURCES,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppData>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const todayDate = format(new Date(), 'yyyy-MM-dd');

    // Helper to get or create today's session
    const getTodaySession = () => {
        return state.sessions.find(s => s.date === todayDate) || null;
    };

    const startSession = () => {
        const existing = getTodaySession();
        if (existing && existing.sessionStart) return; // Already started

        const newSession: DailySession = existing || {
            date: todayDate,
            sessionStart: new Date().toISOString(),
            sessionEnd: null,
            totalTimeSpentSeconds: 0,
            checklist: DEFAULT_CHECKLIST.map(item => ({ ...item })), // Deep copy
            applicationsCount: 0,
            recruiterMessagesCount: 0,
            notes: '',
        };

        // If it was just created, we need to add it. If it existed but wasn't started (edge case), update it.
        // Actually, "Start Session" implies marking the timestamp.

        setState(prev => {
            const otherSessions = prev.sessions.filter(s => s.date !== todayDate);
            return {
                ...prev,
                sessions: [...otherSessions, { ...newSession, sessionStart: new Date().toISOString() }]
            };
        });
    };

    const endSession = () => {
        const today = getTodaySession();
        if (!today) return;

        setState(prev => {
            const otherSessions = prev.sessions.filter(s => s.date !== todayDate);
            return {
                ...prev,
                sessions: [...otherSessions, { ...today, sessionEnd: new Date().toISOString() }]
            };
        });
    };

    const updateChecklistItem = (itemId: string, updates: Partial<ChecklistItem>) => {
        setState(prev => {
            const today = prev.sessions.find(s => s.date === todayDate) || {
                date: todayDate,
                sessionStart: null,
                sessionEnd: null,
                totalTimeSpentSeconds: 0,
                checklist: DEFAULT_CHECKLIST.map(item => ({ ...item })),
                applicationsCount: 0,
                recruiterMessagesCount: 0,
                notes: '',
            };

            const newChecklist = today.checklist.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
            );

            // Recalculate total time if timeSpentSeconds changed
            const totalTime = newChecklist.reduce((acc, item) => acc + item.timeSpentSeconds, 0);

            const updatedSession = { ...today, checklist: newChecklist, totalTimeSpentSeconds: totalTime };

            const otherSessions = prev.sessions.filter(s => s.date !== todayDate);
            return {
                ...prev,
                sessions: [...otherSessions, updatedSession]
            };
        });
    };

    const addApplication = (app: JobApplication) => {
        setState(prev => ({
            ...prev,
            applications: [...prev.applications, app]
        }));
    };

    const updateApplication = (appId: string, updates: Partial<JobApplication>) => {
        setState(prev => ({
            ...prev,
            applications: prev.applications.map(app => app.id === appId ? { ...app, ...updates } : app)
        }));
    };

    const deleteApplication = (appId: string) => {
        setState(prev => ({
            ...prev,
            applications: prev.applications.filter(app => app.id !== appId)
        }));
    };

    const updateStudyDay = (dayNumber: number, updates: Partial<StudyDay>) => {
        setState(prev => ({
            ...prev,
            studyProgress: {
                ...prev.studyProgress,
                [dayNumber]: { ...prev.studyProgress[dayNumber], ...updates }
            }
        }));
    };

    const setStudyPlanStartDate = (date: string) => {
        setState(prev => ({ ...prev, studyPlanStartDate: date }));
    };

    const loadStudyPlan = (newPlan: StudyDay[]) => {
        const newProgress = newPlan.reduce((acc, day) => ({ ...acc, [day.dayNumber]: day }), {});
        setState(prev => ({
            ...prev,
            studyProgress: newProgress,
            studyPlanStartDate: null // Reset start date so user can start fresh
        }));
    };

    const updateResources = (resources: ResourceCategory[]) => {
        setState(prev => ({ ...prev, resources }));
    };

    const activeSession = getTodaySession();

    // Logic to determine if "Session is running" - strictly speaking, it's running if start exists and end doesn't.
    // But user might want to just track data without "starting".
    // The requirement says: "Start Session" records timestamp.

    return (
        <AppContext.Provider value={{
            state,
            startSession,
            endSession,
            updateChecklistItem,
            addApplication,
            updateApplication,
            deleteApplication,
            updateStudyDay,
            setStudyPlanStartDate,
            loadStudyPlan,
            updateResources,
            activeSession,
            todaySession: activeSession
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppStore = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppStore must be used within AppProvider');
    return context;
};
