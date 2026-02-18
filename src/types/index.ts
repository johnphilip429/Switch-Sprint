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
    salaryExpected?: string;
    salaryOffered?: string;
};

export type StudyDay = {
    dayNumber: number;
    topicSQL: string;
    topicPython: string;
    topicSpark: string;
    practiceTask: string;
    completed: boolean;
    completedDate?: string; // ISO timestamp
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

export type ContactStatus = 'New' | 'Contacted' | 'Responded' | 'Ghosted' | 'Meeting Set';

export type Contact = {
    id: string;
    name: string;
    role: string;
    company: string;
    link: string; // LinkedIn or other
    status: ContactStatus;
    lastContactDate: string | null;
    notes: string;
    email?: string;
};

export type ResumeVersion = {
    id: string;
    name: string; // e.g. "Data Analyst Resume v2"
    fileUrl: string; // Could be local path or online link
    type: 'PDF' | 'Word' | 'Google Doc';
    lastUpdated: string;
    notes: string;
};

export type AppData = {
    sessions: DailySession[];
    applications: JobApplication[];
    contacts: Contact[];
    resumes: ResumeVersion[];
    studyPlanStartDate: string | null;
    focusedStudyDay: number; // Track which day of the plan the user is currently on (independent of calendar)
    studyProgress: Record<number, StudyDay>; // Keyed by dayNumber
    resources: ResourceCategory[];
};
