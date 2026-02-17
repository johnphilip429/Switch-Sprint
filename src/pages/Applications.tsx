import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Card, Button, Badge } from '../components/ui';
import { ApplicationModal } from '../components/applications/ApplicationModal';
// Removed unused MoreHorizontal, added Clock
import { Plus, Search, ExternalLink, Calendar, Trash2, Edit2, Clock } from 'lucide-react';
import type { JobApplication, ApplicationStatus } from '../types';
import { format, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

export const Applications: React.FC = () => {
    const { state, addApplication, updateApplication, deleteApplication } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
    const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');

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
            case 'Applied': return 'bg-slate-100 text-slate-700';
            case 'HR Screen': return 'bg-blue-100 text-blue-700';
            case 'Tech Round': return 'bg-indigo-100 text-indigo-700';
            case 'Assignment': return 'bg-violet-100 text-violet-700';
            case 'Offer': return 'bg-emerald-100 text-emerald-700';
            case 'Joined': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100';
        }
    };

    const filteredApps = state.applications.filter(app => {
        const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
        const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.roleTitle.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Applications</h1>
                    <p className="text-slate-500">Track and manage your job search pipeline.</p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus size={18} className="mr-2" /> Add Application
                </Button>
            </div>

            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            placeholder="Search companies or roles..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="p-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 min-w-[150px]"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as any)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="HR Screen">HR Screen</option>
                        <option value="Tech Round">Tech Round</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </Card>

            <div className="grid gap-4">
                {filteredApps.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        No applications found. Start applying!
                    </div>
                ) : (
                    filteredApps.map(app => (
                        <div key={app.id} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow">
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg">{app.roleTitle}</h3>
                                        <p className="text-slate-600 dark:text-slate-400">{app.company} • {app.location}</p>
                                    </div>
                                    <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} /> Applied: {format(parseISO(app.dateApplied), 'MMM d')}
                                    </div>
                                    {app.nextFollowUpDate && (
                                        <div className={cn("flex items-center gap-1",
                                            new Date(app.nextFollowUpDate) <= new Date() ? "text-amber-600 font-medium" : ""
                                        )}>
                                            <Clock size={14} /> Follow-up: {format(parseISO(app.nextFollowUpDate), 'MMM d')}
                                        </div>
                                    )}
                                    {app.jobLink && (
                                        <a href={app.jobLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600">
                                            <ExternalLink size={14} /> Description
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex sm:flex-col items-center justify-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-4">
                                <Button variant="outline" size="sm" onClick={() => openEditModal(app)}>
                                    <Edit2 size={16} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete?')) deleteApplication(app.id) }} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
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
