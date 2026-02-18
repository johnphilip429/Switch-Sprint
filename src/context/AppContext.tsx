import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppData, DailySession, JobApplication, StudyDay, ResourceCategory, ChecklistItem, Contact, ResumeVersion } from '../types';
import { DEFAULT_CHECKLIST, DEFAULT_RESOURCES, STUDY_PLAN } from '../data/seed';
import { format } from 'date-fns';
import { saveToHandle, getNewFileHandle } from '../lib/export';
import { get, set } from 'idb-keyval';

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
    advanceStudyDay: () => void;

    // Contacts
    addContact: (contact: Contact) => void;
    updateContact: (id: string, updates: Partial<Contact>) => void;
    deleteContact: (id: string) => void;

    // Resumes
    addResume: (resume: ResumeVersion) => void;
    deleteResume: (id: string) => void;

    // Timer
    activeTimerId: string | null;
    toggleTimer: (itemId: string) => void;
    // Backup
    backupStatus: 'disconnected' | 'connected' | 'saving' | 'saved' | 'error';
    connectBackupFolder: () => Promise<void>;
    lastBackupTime: Date | null;
    verifyBackupConnection: () => Promise<void>;
    backupFolderName: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'switch-sprint-data-v1';

const INITIAL_STATE: AppData = {
    sessions: [],
    applications: [],
    contacts: [],
    resumes: [],
    studyPlanStartDate: null,
    focusedStudyDay: 1,
    studyProgress: STUDY_PLAN.reduce((acc, day) => ({ ...acc, [day.dayNumber]: day }), {}),
    resources: DEFAULT_RESOURCES,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppData>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Merge with INITIAL_STATE to ensure new fields (contacts, resumes) exist
                return { ...INITIAL_STATE, ...parsed };
            } catch (e) {
                console.error("Failed to parse stored state", e);
                return INITIAL_STATE;
            }
        }
        return INITIAL_STATE;
    });

    const [backupDirHandle, setBackupDirHandle] = useState<any>(null);
    const [backupStatus, setBackupStatus] = useState<'disconnected' | 'connected' | 'saving' | 'saved' | 'error'>('disconnected');
    const [lastBackupTime, setLastBackupTime] = useState<Date | null>(null);

    // Timer State
    const [activeTimerId, setActiveTimerId] = useState<string | null>(null);
    const intervalRef = React.useRef<number | null>(null);

    // Load Backup Handle from IDB
    useEffect(() => {
        const loadHandle = async () => {
            const handle = await get('backupDirHandle');
            if (handle) {
                setBackupDirHandle(handle);
                // We can't immediately write without user gesture re-verification usually, 
                // but we can show "Connected" status. 
                // However, for writing in bg, we might need permission.
                // Let's assume connected but might need re-verification.
                // We'll check permissions on first write or explicit verify.
                const permission = await (handle as any).queryPermission({ mode: 'readwrite' });
                if (permission === 'granted') {
                    setBackupStatus('connected');
                } else {
                    // Start as disconnected but we have the handle - maybe a "Reconnect" state?
                    // For simplicity, let's just keep handle but status disconnected until they verify.
                    // ACTUALLY: User wants seamless. Let's try to prompt or handle gracefully.
                    setBackupStatus('disconnected');
                }
            }
        };
        loadHandle();
    }, []);

    // Global Timer Logic
    useEffect(() => {
        if (activeTimerId) {
            intervalRef.current = window.setInterval(() => {
                // We need to update the checklist item
                setState(prev => {
                    // Re-calc inside interval to be safe? Or closure? 'todayDate' from outer scope is closure.
                    // But 'todayDate' variable above is derived from 'new Date()' on render. 
                    // Better to re-derive or trust variable if component re-renders.
                    // Since interval runs in effect closure, 'todayDate' is stale.
                    // We must find the today session dynamically in settter.

                    const currentTodayDate = format(new Date(), 'yyyy-MM-dd');
                    const today = prev.sessions.find(s => s.date === currentTodayDate);

                    if (!today) return prev; // Should verify session is running? 

                    const item = today.checklist.find(i => i.id === activeTimerId);
                    if (!item) return prev; // Item not found

                    const newChecklist = today.checklist.map(i =>
                        i.id === activeTimerId ? { ...i, timeSpentSeconds: i.timeSpentSeconds + 1 } : i
                    );
                    const totalTime = newChecklist.reduce((acc, i) => acc + i.timeSpentSeconds, 0);

                    const updatedSession = { ...today, checklist: newChecklist, totalTimeSpentSeconds: totalTime };
                    const otherSessions = prev.sessions.filter(s => s.date !== currentTodayDate);

                    return {
                        ...prev,
                        sessions: [...otherSessions, updatedSession]
                    };
                });
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
    }, [activeTimerId]);

    const toggleTimer = (itemId: string) => {
        if (activeTimerId === itemId) {
            setActiveTimerId(null);
        } else {
            setActiveTimerId(itemId);
        }
    };


    // Auto-save to LocalStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    // Continuous Backup to File System
    useEffect(() => {
        if (!backupDirHandle) return;

        const saveToDisk = async () => {
            try {
                // Check permission first
                const permission = await (backupDirHandle as any).queryPermission({ mode: 'readwrite' });
                if (permission !== 'granted') {
                    // We can't request here (not user gesture), so we just return/fail silently or set status
                    // If it's prompt, we can't trigger it.
                    // The user MUST verify connection once per session if browser requires it.
                    console.warn("Permission not granted for background save.");
                    return;
                }

                setBackupStatus('saving');

                // 1. Save JSON Backup
                const jsonHandle = await getNewFileHandle(backupDirHandle, 'switch-sprint-backup.json');
                await saveToHandle(jsonHandle, JSON.stringify(state, null, 2));

                // 2. Save Excel Report (Maybe opt-in or less frequent? For now, do both for safety)
                // Excel generation is sync but might be heavy. Let's do it.
                // const excelBlob = exportToExcel(state);
                // const excelHandle = await getNewFileHandle(backupDirHandle, 'switch-sprint-report.xlsx');
                // await saveToHandle(excelHandle, excelBlob);

                setBackupStatus('saved');
                setLastBackupTime(new Date());
            } catch (err) {
                console.error("Auto-backup failed:", err);
                setBackupStatus('error');
            }
        };

        // Debounce save (2 seconds)
        const timer = setTimeout(saveToDisk, 2000);
        return () => clearTimeout(timer);
    }, [state, backupDirHandle]);

    const connectBackupFolder = async () => {
        try {
            // @ts-ignore - showDirectoryPicker is not yet in standard types
            const handle = await window.showDirectoryPicker();
            setBackupDirHandle(handle);
            setBackupStatus('connected');
            await set('backupDirHandle', handle); // Persist handle
        } catch (err) {
            console.error("Failed to connect folder:", err);
            // User likely cancelled
        }
    };

    const verifyBackupConnection = async () => {
        if (!backupDirHandle) return;
        try {
            // Request permission (must be user gesture)
            const permission = await (backupDirHandle as any).requestPermission({ mode: 'readwrite' });
            if (permission === 'granted') {
                setBackupStatus('connected');
            } else {
                setBackupStatus('disconnected');
            }
        } catch (err) {
            console.error("Failed to verify permission:", err);
        }
    };

    const todayDate = format(new Date(), 'yyyy-MM-dd');

    // Helper to get or create today's session
    const getTodaySession = () => {
        return state.sessions.find(s => s.date === todayDate) || null;
    };

    const startSession = () => {
        const existing = getTodaySession();
        if (existing && existing.sessionStart && !existing.sessionEnd) return; // Already running

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

        // If it was just created, we need to add it. If it existed but wasn't started (edge case), update it.
        // If it existed and was ended, we RESUME it (clear sessionEnd).

        setState(prev => {
            const otherSessions = prev.sessions.filter(s => s.date !== todayDate);
            // If resuming (existing has sessionEnd), start remains same, end becomes null.
            const updatedSession = existing ? { ...existing, sessionEnd: null } : { ...newSession, sessionStart: new Date().toISOString() };

            return {
                ...prev,
                sessions: [...otherSessions, updatedSession]
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
        setState(prev => {
            // 1. Update Study Progress
            const newStudyProgress = {
                ...prev.studyProgress,
                [dayNumber]: { ...prev.studyProgress[dayNumber], ...updates }
            };

            // 2. Ensure a Session exists for Today (so it shows in Analytics)
            const todayDate = format(new Date(), 'yyyy-MM-dd');
            const sessionExists = prev.sessions.find(s => s.date === todayDate);

            let newSessions = prev.sessions;
            if (!sessionExists) {
                const newSession: DailySession = {
                    date: todayDate,
                    sessionStart: new Date().toISOString(), // Mark start now as they are active
                    sessionEnd: null,
                    totalTimeSpentSeconds: 0,
                    checklist: DEFAULT_CHECKLIST.map(item => ({ ...item })),
                    applicationsCount: 0,
                    recruiterMessagesCount: 0,
                    notes: '',
                };
                newSessions = [...prev.sessions, newSession];
            }

            return {
                ...prev,
                studyProgress: newStudyProgress,
                sessions: newSessions
            };
        });
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

    // Contacts CRUD
    const addContact = (contact: Contact) => {
        setState(prev => ({ ...prev, contacts: [...prev.contacts, contact] }));
    };
    const updateContact = (id: string, updates: Partial<Contact>) => {
        setState(prev => ({
            ...prev,
            contacts: prev.contacts.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
    };
    const deleteContact = (id: string) => {
        setState(prev => ({ ...prev, contacts: prev.contacts.filter(c => c.id !== id) }));
    };

    // Resumes CRUD
    const addResume = (resume: ResumeVersion) => {
        setState(prev => ({ ...prev, resumes: [...prev.resumes, resume] }));
    };
    const deleteResume = (id: string) => {
        setState(prev => ({ ...prev, resumes: prev.resumes.filter(r => r.id !== id) }));
    };

    const activeSession = getTodaySession();

    const advanceStudyDay = () => {
        setState(prev => {
            const nextDay = prev.focusedStudyDay + 1;

            const currentTodayDate = format(new Date(), 'yyyy-MM-dd');
            // Find today's session in the previous state to reset its checklist
            const todayInPrev = prev.sessions.find(s => s.date === currentTodayDate);

            // We need to map over sessions to update the specific one
            let newSessions = prev.sessions;

            if (todayInPrev) {
                const newChecklist = todayInPrev.checklist.map(item => {
                    if (['sql', 'python', 'spark'].includes(item.id)) {
                        return { ...item, completed: false, timeSpentSeconds: 0 };
                    }
                    return item;
                });

                const updatedSession = { ...todayInPrev, checklist: newChecklist };
                newSessions = prev.sessions.map(s => s.date === currentTodayDate ? updatedSession : s);
            }

            return {
                ...prev,
                focusedStudyDay: nextDay,
                sessions: newSessions
            };
        });
    };


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
            addContact,
            updateContact,
            deleteContact,
            addResume,
            deleteResume,
            activeSession,
            todaySession: activeSession,
            backupStatus,
            connectBackupFolder,
            lastBackupTime,

            activeTimerId,
            toggleTimer,
            verifyBackupConnection,
            backupFolderName: backupDirHandle ? (backupDirHandle as any).name : null,
            advanceStudyDay
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
