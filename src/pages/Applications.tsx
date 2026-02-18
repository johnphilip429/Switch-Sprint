import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Button, Badge } from '../components/ui';
import { ApplicationModal } from '../components/applications/ApplicationModal';
import { Plus, Trash2 } from 'lucide-react';
import type { JobApplication, ApplicationStatus } from '../types';

export const Applications: React.FC = () => {
    const { state, addApplication, updateApplication, deleteApplication } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

    const handleAdd = (app: JobApplication) => {
        if (editingApp) {
            updateApplication(app.id, app);
        } else {
            addApplication(app);
        }
    };

    const openAddModal = () => {
        setEditingApp(null);
        setIsModalOpen(true);
    };

    const openEditModal = (app: JobApplication) => {
        setEditingApp(app);
        setIsModalOpen(true);
    };

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case 'Applied': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
            case 'HR Screen': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Tech Round': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
            case 'Assignment': return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300';
            case 'Offer': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
            case 'Joined': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-slate-100';
        }
    };


    // Custom Columns for the Canvas
    const CANVAS_COLUMNS = [
        { title: 'To Apply', color: 'bg-indigo-100/50 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200', headerColor: 'bg-indigo-200/50 dark:bg-indigo-900/50', id: 'To Apply' },
        { title: 'Applied', color: 'bg-sky-100/50 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200', headerColor: 'bg-sky-200/50 dark:bg-sky-900/50', id: 'Applied' },
        { title: 'Interview', color: 'bg-amber-100/50 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200', headerColor: 'bg-amber-200/50 dark:bg-amber-900/50', id: 'Interview' },
        { title: 'Offer!', color: 'bg-emerald-100/50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200', headerColor: 'bg-emerald-200/50 dark:bg-emerald-900/50', id: 'Offer!' },
        { title: 'Rejected', color: 'bg-red-100/50 text-red-800 dark:bg-red-900/40 dark:text-red-200', headerColor: 'bg-red-200/50 dark:bg-red-900/50', id: 'Rejected' },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden bg-white/60 dark:bg-black/60 backdrop-blur-2xl rounded-2xl shadow-2xl relative border border-white/20 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5">

            {/* Window Header */}
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md h-12 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                <div className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                    Career Canvas
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-white/20" onClick={openAddModal}>
                    <Plus size={18} />
                </Button>
            </div>

            {/* Canvas Body */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 relative">
                <div className="flex gap-4 h-full min-w-max">
                    {CANVAS_COLUMNS.map(col => {
                        const apps = state.applications.filter(a => {
                            // Mapping logic to match columns
                            if (col.id === 'To Apply') return a.status === 'Applied' && a.notes.includes('#todo');
                            if (col.id === 'Applied') return a.status === 'Applied' && !a.notes.includes('#todo');
                            if (col.id === 'Interview') return ['HR Screen', 'Tech Round', 'Assignment'].includes(a.status);
                            if (col.id === 'Offer!') return ['Offer', 'Joined'].includes(a.status);
                            if (col.id === 'Rejected') return a.status === 'Rejected';
                            return false;
                        });

                        return (
                            <div key={col.id} className="flex-1 min-w-[200px] md:min-w-0 flex flex-col h-full bg-white/20 dark:bg-black/20 rounded-xl shadow-inner backdrop-blur-sm overflow-hidden border border-white/10 transition-all duration-300">
                                {/* Column Header */}
                                <div className={`${col.headerColor} p-3 flex items-center justify-center gap-2 font-bold text-slate-800 dark:text-slate-200 border-b border-white/10 text-sm`}>
                                    {col.title}
                                    <span className="text-xs opacity-60 bg-black/10 px-2 py-0.5 rounded-full">{apps.length}</span>
                                </div>

                                {/* Cards Container */}
                                <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                                    {apps.map(app => (
                                        <div
                                            key={app.id}
                                            onClick={() => openEditModal(app)}
                                            className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group relative border border-white/20"
                                        >
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
                                                    {app.company.substring(0, 1)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">{app.company}</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{app.roleTitle}</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mb-3">
                                                <Badge className={getStatusColor(app.status) + " text-[10px] px-1.5 py-0.5"}>{app.status}</Badge>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <span>{app.location.split(',')[0]}</span>
                                                </div>
                                                <button
                                                    className="w-6 h-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 flex items-center justify-center text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Delete application?')) deleteApplication(app.id);
                                                    }}
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        className="w-full border-2 border-dashed border-white/20 text-slate-500 dark:text-slate-400 hover:border-white/40 hover:bg-white/10"
                                        onClick={openAddModal}
                                    >
                                        <Plus size={16} className="mr-2" /> New
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <ApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAdd}
                initialData={editingApp}
            />
        </div>
    );
};
