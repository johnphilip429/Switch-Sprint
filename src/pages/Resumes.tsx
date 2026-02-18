import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Card, Button, Badge } from '../components/ui';
import { FileText, Plus, ExternalLink, Trash2, Calendar, Link as LinkIcon, FileJson } from 'lucide-react';
import type { ResumeVersion } from '../types';
import { format } from 'date-fns';
import { WindowFrame } from '../components/layout/WindowFrame';

export const Resumes: React.FC = () => {
    const { state, addResume, deleteResume } = useAppStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newResume, setNewResume] = useState<Partial<ResumeVersion>>({ type: 'PDF' });

    const [activeTab, setActiveTab] = useState<'resumes' | 'cover-letter'>('resumes');
    const [coverLetterData, setCoverLetterData] = useState({
        company: '',
        role: '',
        yearsExp: '',
        skills: ''
    });
    const [generatedLetter, setGeneratedLetter] = useState('');

    const generateCoverLetter = () => {
        const { company, role, yearsExp, skills } = coverLetterData;
        const letter = `Dear Hiring Manager at ${company},

I am writing to express my strong interest in the ${role} position. With over ${yearsExp} years of experience in data analytics and a deep proficiency in ${skills}, I am confident in my ability to contribute effectively to your team from day one.

In my previous roles, I have honed my skills in data modeling, visualization, and strategic analysis. I am particularly drawn to ${company} due to its reputation for innovation and excellence in the industry.

I would welcome the opportunity to discuss how my background and technical expertise align with the goals of your team. Thank you for considering my application.

Sincerely,
[Your Name]`;
        setGeneratedLetter(letter);
    };

    const handleAdd = () => {
        if (!newResume.name || !newResume.fileUrl) return;
        addResume({
            id: crypto.randomUUID(),
            name: newResume.name,
            fileUrl: newResume.fileUrl,
            type: newResume.type as 'PDF' | 'Word' | 'Google Doc' || 'PDF',
            lastUpdated: new Date().toISOString(),
            notes: newResume.notes || ''
        });
        setIsAdding(false);
        setNewResume({ type: 'PDF' });
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'Google Doc': return <LinkIcon size={20} className="text-blue-500" />;
            case 'Word': return <FileText size={20} className="text-blue-700" />;
            default: return <FileJson size={20} className="text-red-500" />;
        }
    };

    return (
        <WindowFrame title="Portfolio Builder" className="h-full">
            <div className="flex flex-col h-full">
                {/* Tab Navigation */}
                <div className="flex border-b border-white/10 px-6 pt-4 gap-6 shrink-0">
                    <button
                        onClick={() => setActiveTab('resumes')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'resumes' ? 'border-orange-500 text-orange-600 dark:text-orange-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Resume Versions
                    </button>
                    <button
                        onClick={() => setActiveTab('cover-letter')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'cover-letter' ? 'border-orange-500 text-orange-600 dark:text-orange-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Cover Letter Generator
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6 md:p-8 custom-scrollbar">
                    {activeTab === 'resumes' ? (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Resume Versions</h1>
                                    <p className="text-slate-500">Track which resume you sent to whom.</p>
                                </div>
                                <Button onClick={() => setIsAdding(true)}>
                                    <Plus size={18} className="mr-2" /> Add Version
                                </Button>
                            </div>

                            {isAdding && (
                                <Card className="p-6 border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-900/10">
                                    <h3 className="font-bold mb-4">Add Resume Version</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            placeholder="Version Name (e.g., Data Analyst V1)"
                                            className="p-2 border rounded"
                                            value={newResume.name || ''}
                                            onChange={e => setNewResume({ ...newResume, name: e.target.value })}
                                        />
                                        <input
                                            placeholder="Link / File Path"
                                            className="p-2 border rounded"
                                            value={newResume.fileUrl || ''}
                                            onChange={e => setNewResume({ ...newResume, fileUrl: e.target.value })}
                                        />
                                        <select
                                            className="p-2 border rounded"
                                            value={newResume.type}
                                            onChange={e => setNewResume({ ...newResume, type: e.target.value as any })}
                                        >
                                            <option value="PDF">PDF</option>
                                            <option value="Word">Word</option>
                                            <option value="Google Doc">Google Doc</option>
                                        </select>
                                        <input
                                            placeholder="Notes (e.g., Emphasizes Python)"
                                            className="p-2 border rounded"
                                            value={newResume.notes || ''}
                                            onChange={e => setNewResume({ ...newResume, notes: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleAdd} disabled={!newResume.name || !newResume.fileUrl}>Save Version</Button>
                                        <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                                    </div>
                                </Card>
                            )}

                            <div className="grid gap-4">
                                {state.resumes.map(resume => (
                                    <div key={resume.id} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                            {getIcon(resume.type)}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg">{resume.name}</h3>
                                                <Badge variant="default" className="text-xs bg-slate-200 text-slate-700 hover:bg-slate-300">{resume.type}</Badge>
                                            </div>
                                            <p className="text-slate-500 text-sm mb-1">{resume.notes}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> Updated: {format(new Date(resume.lastUpdated), 'MMM d, yyyy')}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 self-end sm:self-center">
                                            <a
                                                href={resume.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors"
                                                title="Open Resume"
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                            <button
                                                onClick={() => deleteResume(resume.id)}
                                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {state.resumes.length === 0 && !isAdding && (
                                    <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>No resume versions tracked yet.</p>
                                        <Button variant="ghost" onClick={() => setIsAdding(true)} className="mt-2 text-orange-600 hover:text-orange-700">
                                            Add your first one
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Cover Letter Generator</h1>
                                <p className="text-slate-500">Generate a tailored cover letter in seconds.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="p-6 space-y-4">
                                    <h3 className="font-bold border-b pb-2">Job Details</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                                            <input
                                                className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                placeholder="e.g. Google"
                                                value={coverLetterData.company}
                                                onChange={e => setCoverLetterData({ ...coverLetterData, company: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Role Title</label>
                                            <input
                                                className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                placeholder="e.g. Senior Data Analyst"
                                                value={coverLetterData.role}
                                                onChange={e => setCoverLetterData({ ...coverLetterData, role: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Years of Experience</label>
                                            <input
                                                className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                placeholder="e.g. 5"
                                                value={coverLetterData.yearsExp}
                                                onChange={e => setCoverLetterData({ ...coverLetterData, yearsExp: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Top 3 Skills (Comma separated)</label>
                                            <input
                                                className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                placeholder="e.g. SQL, Python, Tableau"
                                                value={coverLetterData.skills}
                                                onChange={e => setCoverLetterData({ ...coverLetterData, skills: e.target.value })}
                                            />
                                        </div>
                                        <Button
                                            onClick={generateCoverLetter}
                                            disabled={!coverLetterData.company || !coverLetterData.role}
                                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3"
                                        >
                                            Generate Letter 🪄
                                        </Button>
                                    </div>
                                </Card>

                                <Card className="p-6 flex flex-col h-full min-h-[400px]">
                                    <h3 className="font-bold border-b pb-2 mb-4">Preview</h3>
                                    {generatedLetter ? (
                                        <>
                                            <textarea
                                                className="flex-1 w-full p-4 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm leading-relaxed resize-none focus:ring-2 focus:ring-orange-500 outline-none"
                                                value={generatedLetter}
                                                onChange={e => setGeneratedLetter(e.target.value)}
                                            />
                                            <Button
                                                variant="outline"
                                                className="mt-4 border-orange-200 text-orange-600 hover:bg-orange-50"
                                                onClick={() => navigator.clipboard.writeText(generatedLetter)}
                                            >
                                                Copy to Clipboard
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-50">
                                            <FileText size={64} className="mb-4" />
                                            <p>Fill form on the left to generate.</p>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </WindowFrame>
    );
};
