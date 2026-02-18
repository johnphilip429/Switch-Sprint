export type QuestionCategory = 'SQL' | 'Python' | 'Behavioral' | 'System Design';

export interface InterviewQuestion {
    id: string;
    category: QuestionCategory;
    question: string;
    hint?: string;
    answer?: string; // For technical questions
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
    // SQL
    {
        id: 'sql-1',
        category: 'SQL',
        question: 'What is the difference between LEFT JOIN and INNER JOIN?',
        hint: 'Think about what happens to rows that don\'t match.',
        answer: 'INNER JOIN returns only rows where there is a match in both tables. LEFT JOIN returns all rows from the left table, and the matched rows from the right table (or NULL if no match).'
    },
    {
        id: 'sql-2',
        category: 'SQL',
        question: 'Explain the difference between CST and RANK functions.',
        hint: 'What happens when two values are identical?',
        answer: 'RANK skips the next number after a tie (e.g., 1, 1, 3). DENSE_RANK does not skip (e.g., 1, 1, 2). ROW_NUMBER gives a unique number to each row regardless of ties.'
    },
    {
        id: 'sql-3',
        category: 'SQL',
        question: 'How do you optimize a slow SQL query?',
        hint: 'Think about indexing and execution plans.',
        answer: '1. Check execution plan (EXPLAIN). 2. Add Indexes on filter/join columns. 3. Avoid SELECT *. 4. Use CTEs/Temp tables appropriately. 5. Avoid functions on indexed columns in WHERE clause.'
    },
    {
        id: 'sql-4',
        category: 'SQL',
        question: 'What is a Window Function?',
        hint: 'OVER clause.',
        answer: 'A window function performs a calculation across a set of table rows that are somehow related to the current row, without grouping rows into a single output row like GROUP BY does.'
    },
    {
        id: 'sql-5',
        category: 'SQL',
        question: 'Explain the difference between WHERE and HAVING.',
        hint: 'Aggregation.',
        answer: 'WHERE filters rows BEFORE aggregation/grouping. HAVING filters groups AFTER aggregation.'
    },
    {
        id: 'sql-6',
        category: 'SQL',
        question: 'What is a Primary Key vs Foreign Key?',
        hint: 'Uniqueness and Relationships.',
        answer: 'Primary Key uniquely identifies a record in a table and cannot be NULL. Foreign Key is a field that links to the Primary Key of another table.'
    },
    // Python
    {
        id: 'py-1',
        category: 'Python',
        question: 'What is the difference between list and tuple?',
        hint: 'Mutability.',
        answer: 'Lists are mutable (can change), defined by []. Tuples are immutable (cannot change), defined by (). Tuples are generally faster and used for fixed data.'
    },
    {
        id: 'py-2',
        category: 'Python',
        question: 'What is a decorator in Python?',
        hint: '@wrapper',
        answer: 'A decorator is a function that takes another function and extends its behavior without explicitly modifying it. Commonly used for logging, auth, or timing.'
    },
    {
        id: 'py-3',
        category: 'Python',
        question: 'Explain lists vs generators (or yield).',
        hint: 'Memory usage.',
        answer: 'Lists store all elements in memory immediately. Generators (yield) produce items one by one on the fly, saving memory for large datasets.'
    },
    {
        id: 'py-4',
        category: 'Python',
        question: 'What is the difference between shallow copy and deep copy?',
        hint: 'Nested objects.',
        answer: 'Shallow copy creates a new object but inserts references into it to the objects found in the original. Deep copy creates a new object and recursively adds copies of nested objects.'
    },
    {
        id: 'py-5',
        category: 'Python',
        question: 'How does memory management work in Python?',
        hint: 'Reference counting and Garbage collection.',
        answer: 'Python uses a private heap space. Memory is managed by reference counting (deleting objects with 0 references) and a cyclic garbage collector to detect circular references.'
    },
    {
        id: 'py-6',
        category: 'Python',
        question: 'What is the GIL?',
        hint: 'Threading.',
        answer: 'Global Interpreter Lock. It is a mutex that allows only one thread to hold the control of the Python interpreter, meaning standard Python threads are not truly parallel on multi-core CPUs.'
    },
    // Behavioral
    {
        id: 'beh-1',
        category: 'Behavioral',
        question: 'Tell me about a time you faced a technical challenge and how you solved it.',
        hint: 'Use the STAR method (Situation, Task, Action, Result).',
    },
    {
        id: 'beh-2',
        category: 'Behavioral',
        question: 'Why do you want to leave your current role?',
        hint: 'Focus on growth and what you run TO, not what you run FROM.',
    },
    {
        id: 'beh-3',
        category: 'Behavioral',
        question: 'Describe a conflict with a coworker and how you handled it.',
        hint: 'Focus on empathy, communication, and resolution.',
    },
    {
        id: 'beh-4',
        category: 'Behavioral',
        question: 'What is your greatest weakness?',
        hint: 'Choose a real weakness but show how you are working to improve it.',
    },
    {
        id: 'beh-5',
        category: 'Behavioral',
        question: 'Where do you see yourself in 5 years?',
        hint: 'Align your goals with the role/company trajectory.',
    }
];
