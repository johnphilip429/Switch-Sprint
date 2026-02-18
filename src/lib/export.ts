import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { AppData, DailySession, JobApplication, StudyDay } from '../types';

// Helper to format date
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const exportToExcel = (data: AppData): Blob => {
    const wb = XLSX.utils.book_new();

    // 1. Sessions Sheet
    const sessionsData = data.sessions.map((session: DailySession) => ({
        Date: session.date,
        'Start Time': session.sessionStart ? new Date(session.sessionStart).toLocaleTimeString() : '',
        'End Time': session.sessionEnd ? new Date(session.sessionEnd).toLocaleTimeString() : '',
        'Duration (Min)': Math.round(session.totalTimeSpentSeconds / 60),
        'Tasks Completed': session.checklist.filter(i => i.completed).length,
        'Total Tasks': session.checklist.length,
        'Applications Added': session.applicationsCount,
        'Notes': session.notes
    }));
    const wsSessions = XLSX.utils.json_to_sheet(sessionsData);
    XLSX.utils.book_append_sheet(wb, wsSessions, "Sessions");

    // 2. Applications Sheet
    const applicationsData = data.applications.map((app: JobApplication) => ({
        Company: app.company,
        Role: app.roleTitle,
        Status: app.status,
        'Date Applied': app.dateApplied,
        Link: app.jobLink,
        Notes: app.notes
    }));
    const wsApps = XLSX.utils.json_to_sheet(applicationsData);
    XLSX.utils.book_append_sheet(wb, wsApps, "Applications");

    // 3. Study Progress Sheet
    const studyData = Object.values(data.studyProgress).map((day: StudyDay) => ({
        Day: day.dayNumber,
        Completed: day.completed ? 'Yes' : 'No',
        'Practice Task': day.practiceTask,
        'SQL Topic': day.topicSQL,
        'Python Topic': day.topicPython,
        Notes: day.notes
    }));
    const wsStudy = XLSX.utils.json_to_sheet(studyData);
    XLSX.utils.book_append_sheet(wb, wsStudy, "Study Plan");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    return dataBlob;
};

export const downloadExcel = (data: AppData) => {
    const blob = exportToExcel(data);
    saveAs(blob, `switch-sprint-report-${formatDate(new Date())}.xlsx`);
};

export const downloadBackup = (data: AppData) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `switch-sprint-backup-${formatDate(new Date())}.json`);
};

// --- File System Access API ---

// Define types locally since they might not be in the environment



export const saveToHandle = async (handle: any, content: string | Blob) => {
    try {
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
    } catch (err) {
        console.error("Failed to write to file handle:", err);
        throw err;
    }
};

export const getNewFileHandle = async (dirHandle: any, filename: string) => {
    return await dirHandle.getFileHandle(filename, { create: true });
};

export const readFromHandle = async (dirHandle: any, filename: string) => {
    try {
        const fileHandle = await dirHandle.getFileHandle(filename, { create: false });
        const file = await fileHandle.getFile();
        const text = await file.text();
        return JSON.parse(text);
    } catch (err) {
        console.warn("File not found or unreadable:", filename);
        return null;
    }
};
