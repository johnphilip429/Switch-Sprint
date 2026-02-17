import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui';
import type { JobApplication, ApplicationStatus } from '../../types';
import { format, addDays } from 'date-fns';

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (app: JobApplication) => void;
    initialData?: JobApplication | null;
}

const STATUS_OPTIONS: ApplicationStatus[] = ['Applied', 'HR Screen', 'Tech Round', 'Assignment', 'Rejected', 'Offer', 'Joined'];
const SOURCE_OPTIONS = ['LinkedIn', 'Naukri', 'Instahyre', 'Cutshort', 'Company Site', 'Referral', 'Other'];
const LOCATIONS = ['Chennai', 'Hyderabad', 'Bengaluru', 'Remote', 'Other'];

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Partial<JobApplication>>({
        company: '',
        roleTitle: '',
        location: 'Remote',
        jobLink: '',
        source: 'LinkedIn',
        status: 'Applied',
        dateApplied: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
        recruiterName: '',
        recruiterContact: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                company: '',
                roleTitle: '',
                location: 'Remote',
                jobLink: '',
                source: 'LinkedIn',
                status: 'Applied',
                dateApplied: format(new Date(), 'yyyy-MM-dd'),
                notes: '',
                recruiterName: '',
                recruiterContact: '',
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Auto-calculate follow up if new
        const nextFollowUp = initialData ? initialData.nextFollowUpDate : format(addDays(new Date(formData.dateApplied!), 3), 'yyyy-MM-dd');

        const app: JobApplication = {
            id: initialData?.id || crypto.randomUUID(),
            company: formData.company!,
            roleTitle: formData.roleTitle!,
            location: formData.location!,
            jobLink: formData.jobLink!,
            source: formData.source!,
            status: formData.status as ApplicationStatus,
            dateApplied: formData.dateApplied!,
            notes: formData.notes || '',
            lastActionDate: formData.dateApplied!, // Default to applied date
            nextFollowUpDate: nextFollowUp,
            recruiterName: formData.recruiterName,
            recruiterContact: formData.recruiterContact,
            followUpStatus: initialData?.followUpStatus || 'Pending',
        };

        onSubmit(app);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold">{initialData ? 'Edit Application' : 'Add Application'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Company *</label>
                        <input
                            required
                            className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Role *</label>
                            <input
                                required
                                className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                value={formData.roleTitle}
                                onChange={e => setFormData({ ...formData, roleTitle: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date Applied</label>
                            <input
                                type="date"
                                required
                                className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                value={formData.dateApplied}
                                onChange={e => setFormData({ ...formData, dateApplied: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                            >
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <select
                                className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            >
                                {LOCATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Source</label>
                            <select
                                className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                value={formData.source}
                                onChange={e => setFormData({ ...formData, source: e.target.value })}
                            >
                                {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Job Link</label>
                            <input
                                type="url"
                                className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                value={formData.jobLink}
                                placeholder="https://..."
                                onChange={e => setFormData({ ...formData, jobLink: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Recruiter Name</label>
                            <input
                                className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                value={formData.recruiterName}
                                onChange={e => setFormData({ ...formData, recruiterName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Recruiter Contact</label>
                            <input
                                className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                value={formData.recruiterContact}
                                onChange={e => setFormData({ ...formData, recruiterContact: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <textarea
                            className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-slate-800 h-20"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Save</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
