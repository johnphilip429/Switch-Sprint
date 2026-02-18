import type { ChecklistItem, ResourceCategory, StudyDay } from '../types';

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
    { id: 'setup', label: 'Setup', defaultTimeMinutes: 5, timeSpentSeconds: 0, isCustom: false, notes: '', completed: false },
    { id: 'apply', label: 'Apply to jobs (10-15 apps)', defaultTimeMinutes: 35, timeSpentSeconds: 0, isCustom: false, notes: '', completed: false },
    { id: 'outreach', label: 'Recruiter outreach (5 msgs)', defaultTimeMinutes: 10, timeSpentSeconds: 0, isCustom: false, notes: '', completed: false },
    { id: 'sql', label: 'SQL practice', defaultTimeMinutes: 25, timeSpentSeconds: 0, isCustom: false, notes: '', completed: false },
    { id: 'python', label: 'Python/pandas practice', defaultTimeMinutes: 20, timeSpentSeconds: 0, isCustom: false, notes: '', completed: false },
    { id: 'spark', label: 'Databricks/Spark practice', defaultTimeMinutes: 15, timeSpentSeconds: 0, isCustom: false, notes: '', completed: false },
    { id: 'wrap', label: 'Wrap + Update tracker', defaultTimeMinutes: 10, timeSpentSeconds: 0, isCustom: false, notes: '', completed: false },
];

export const STUDY_PLAN: StudyDay[] = [
    { dayNumber: 1, topicSQL: 'Joins basics', topicPython: 'Read Excel/CSV + export', topicSpark: 'DF basics', practiceTask: 'Load a CSV into Spark DF and show schema', completed: false, notes: '' },
    { dayNumber: 2, topicSQL: 'Group by + having', topicPython: 'Groupby/agg', topicSpark: 'GroupBy/agg', practiceTask: 'Calculate avg salary per department', completed: false, notes: '' },
    { dayNumber: 3, topicSQL: 'Row_number/rank dedupe', topicPython: 'Latest per group', topicSpark: 'Window intro', practiceTask: 'Find most recent transaction per user', completed: false, notes: '' },
    { dayNumber: 4, topicSQL: 'Nulls/coalesce/case', topicPython: 'Missing values + cleaning', topicSpark: 'Trim/lower/null handling', practiceTask: 'Clean a dirty dataset', completed: false, notes: '' },
    { dayNumber: 5, topicSQL: 'Multi-CTE business query', topicPython: 'Merge + validate counts', topicSpark: 'Joins + broadcast concept', practiceTask: 'Join Sales and Customers tables', completed: false, notes: '' },
    { dayNumber: 6, topicSQL: 'Performance basics', topicPython: 'Vectorization', topicSpark: 'Partitions + cache concept', practiceTask: 'Optimize a slow join', completed: false, notes: '' },
    { dayNumber: 7, topicSQL: 'Mock: 2 SQL timed', topicPython: '1 pandas timed', topicSpark: 'Spark explain pipeline + HR practice', practiceTask: 'Simulate a 30-min coding round', completed: false, notes: '' },
    { dayNumber: 8, topicSQL: 'Lag/lead', topicPython: 'Shift/rolling', topicSpark: 'Window lag/lead', practiceTask: 'Calculate WoW growth', completed: false, notes: '' },
    { dayNumber: 9, topicSQL: 'Normalization + duplicates', topicPython: 'Text normalization function', topicSpark: 'Normalization columns', practiceTask: 'Normalize a denormalized table', completed: false, notes: '' },
    { dayNumber: 10, topicSQL: 'Incremental load/upsert concept', topicPython: 'Idempotent export', topicSpark: 'Delta MERGE concept', practiceTask: 'Implement an upsert logic', completed: false, notes: '' },
    { dayNumber: 11, topicSQL: 'Metrics + funnel', topicPython: 'Weekly summary table', topicSpark: 'Write + metrics concept', practiceTask: 'Build a conversion funnel', completed: false, notes: '' },
    { dayNumber: 12, topicSQL: 'Case study: design query + explain', topicPython: 'End-to-end small pipeline', topicSpark: 'Scaling explanation', practiceTask: 'Design a data pipeline architecture', completed: false, notes: '' },
    { dayNumber: 13, topicSQL: 'Interview simulation: SQL timed', topicPython: 'Pandas timed', topicSpark: 'Spark talk track + HR', practiceTask: 'Full mock interview', completed: false, notes: '' },
    { dayNumber: 14, topicSQL: 'Final simulation', topicPython: 'Finalize 1 portfolio script/notebook', topicSpark: 'Update resume bullets', practiceTask: 'Polish resume and apply', completed: false, notes: '' },
];

export const DEFAULT_RESOURCES: ResourceCategory[] = [
    {
        id: 'sql',
        title: 'SQL Resources',
        links: [
            { id: 'sql1', title: 'SQLZoo', url: 'https://sqlzoo.net/', checked: false },
            { id: 'sql2', title: 'Mode Analytics SQL Tutorial', url: 'https://mode.com/sql-tutorial/', checked: false },
        ]
    },
    {
        id: 'python',
        title: 'Python/Pandas',
        links: [
            { id: 'py1', title: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/', checked: false },
            { id: 'py2', title: 'Real Python', url: 'https://realpython.com/', checked: false },
        ]
    },
    {
        id: 'spark',
        title: 'Databricks/Spark',
        links: [
            { id: 'spark1', title: 'Spark By Examples', url: 'https://sparkbyexamples.com/', checked: false },
            { id: 'spark2', title: 'Databricks Academy', url: 'https://www.databricks.com/learn/training/home', checked: false },
        ]
    },
    {
        id: 'audio',
        title: 'Audio Books & Podcasts',
        links: [
            { id: 'audio1', title: 'Python for Everyone (Audio Course)', url: 'https://www.youtube.com/watch?v=8DvywoWv6fI', checked: false },
            { id: 'audio2', title: 'SQL Tutorial for Beginners (Full Course)', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', checked: false },
            { id: 'audio3', title: 'Data Engineering Podcast', url: 'https://www.dataengineeringpodcast.com/', checked: false },
            { id: 'audio4', title: 'Databricks - The Data Team Podcast', url: 'https://www.databricks.com/resources/podcasts/data-team', checked: false },
        ]
    }
];
