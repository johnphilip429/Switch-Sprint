export type ChecklistItem = {
    id: string;
    label: string;
    defaultTimeMinutes: number;
    timeSpentSeconds: number;
    isCustom: boolean;
    notes: string;
    completed: boolean;
};

export type DailySession = {
    date: string; // ISO date string (YYYY-MM-DD)
    sessionStart: string | null; // ISO timestamp
    sessionEnd: string | null; // ISO timestamp
    totalTimeSpentSeconds: number;
    checklist: ChecklistItem[];
    applicationsCount: number;
    recruiterMessagesCount: number;
    notes: string;
};

export type ApplicationStatus = 'Applied' | 'HR Screen' | 'Tech Round' | 'Assignment' | 'Rejected' | 'Offer' | 'Joined';

export type JobApplication = {
    id: string;
    company: string;
    roleTitle: string;
    location: string;
    jobLink: string;
    source: string;
    status: ApplicationStatus;
    dateApplied: string;
    notes: string;
    lastActionDate: string;
    nextFollowUpDate: string | null;
    recruiterName?: string;
    recruiterContact?: string;
    followUpStatus: 'Pending' | 'Done' | 'Stale';
};

export type StudyDay = {
    dayNumber: number;
    topicSQL: string;
    topicPython: string;
    topicSpark: string;
    practiceTask: string;
    completed: boolean;
    notes: string;
    customTopics?: string[];
};

export type ResourceLink = {
    id: string;
    title: string;
    url: string;
    checked: boolean;
};

export type ResourceCategory = {
    id: string;
    title: string;
    links: ResourceLink[];
};

export type AppData = {
    sessions: DailySession[];
    applications: JobApplication[];
    studyPlanStartDate: string | null;
    studyProgress: Record<number, StudyDay>; // Keyed by dayNumber
    resources: ResourceCategory[];
};
