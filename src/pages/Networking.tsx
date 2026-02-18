import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Card, Button, Badge } from '../components/ui';
import { Search, Mail, ExternalLink, Calendar, Trash2, Copy, Check, UserPlus } from 'lucide-react';
import type { Contact, ContactStatus } from '../types';
import { format } from 'date-fns';
import { WindowFrame } from '../components/layout/WindowFrame';

export const Networking: React.FC = () => {
    const { state, addContact, deleteContact } = useAppStore();
    const [activeTab, setActiveTab] = useState<'tracker' | 'generator'>('tracker');
    const [searchTerm, setSearchTerm] = useState('');

    // Generator State
    const [genName, setGenName] = useState('');
    const [genCompany, setGenCompany] = useState('');
    const [genRole, setGenRole] = useState('');
    const [genTopic, setGenTopic] = useState('');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [copied, setCopied] = useState(false);

    // Contact Modal State (Simple inline for now or could be modal)
    const [isAddingContact, setIsAddingContact] = useState(false);
    const [newContact, setNewContact] = useState<Partial<Contact>>({ status: 'New' });

    const filteredContacts = state.contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleGenerateEmail = () => {
        const email = `Hi ${genName},

I hope you're having a great week.

I've been following ${genCompany}'s work on ${genTopic} and am really impressed. As a ${genRole} myself, I'd love to learn more about how your team approaches this.

Would you be open to a brief 15-minute chat next week? No pressure at all, but I'd value your perspective.

Best,
[Your Name]`;
        setGeneratedEmail(email);
        setCopied(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAddContact = () => {
        if (!newContact.name || !newContact.company) return;
        addContact({
            id: crypto.randomUUID(),
            name: newContact.name,
            company: newContact.company,
            role: newContact.role || '',
            link: newContact.link || '',
            status: newContact.status as ContactStatus || 'New',
            lastContactDate: new Date().toISOString(),
            notes: newContact.notes || '',
            email: newContact.email || ''
        });
        setIsAddingContact(false);
        setNewContact({ status: 'New' });
    };

    const StatusBadge = ({ status }: { status: ContactStatus }) => {
        const colors = {
            'New': 'bg-slate-100 text-slate-700',
            'Contacted': 'bg-blue-100 text-blue-700',
            'Responded': 'bg-emerald-100 text-emerald-700',
            'Ghosted': 'bg-red-100 text-red-700',
            'Meeting Set': 'bg-violet-100 text-violet-700'
        };
        return <Badge className={colors[status] || 'bg-slate-100'}>{status}</Badge>;
    };

    return (
        <WindowFrame title="Connection Hub" className="h-full">
            <div className="space-y-6 max-w-5xl mx-auto p-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Networking Hub</h1>
                        <p className="text-slate-500">Build your network and generate outreach in seconds.</p>
                    </div>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('tracker')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'tracker' ? 'bg-white dark:bg-slate-700 shadow text-blue-600' : 'text-slate-500'}`}
                        >
                            Tracker
                        </button>
                        <button
                            onClick={() => setActiveTab('generator')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'generator' ? 'bg-white dark:bg-slate-700 shadow text-blue-600' : 'text-slate-500'}`}
                        >
                            Email Generator
                        </button>
                    </div>
                </div>

                {activeTab === 'tracker' && (
                    <div className="space-y-6">
                        <Card className="p-4">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                    <input
                                        placeholder="Search contacts..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button onClick={() => setIsAddingContact(true)}>
                                    <UserPlus size={18} className="mr-2" /> Add Contact
                                </Button>
                            </div>
                        </Card>

                        {isAddingContact && (
                            <Card className="p-6 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10">
                                <h3 className="font-bold mb-4">New Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input placeholder="Name" className="p-2 border rounded" value={newContact.name || ''} onChange={e => setNewContact({ ...newContact, name: e.target.value })} />
                                    <input placeholder="Company" className="p-2 border rounded" value={newContact.company || ''} onChange={e => setNewContact({ ...newContact, company: e.target.value })} />
                                    <input placeholder="Role" className="p-2 border rounded" value={newContact.role || ''} onChange={e => setNewContact({ ...newContact, role: e.target.value })} />
                                    <input placeholder="LinkedIn Value" className="p-2 border rounded" value={newContact.link || ''} onChange={e => setNewContact({ ...newContact, link: e.target.value })} />
                                    <select className="p-2 border rounded" value={newContact.status} onChange={e => setNewContact({ ...newContact, status: e.target.value as any })}>
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Responded">Responded</option>
                                        <option value="Meeting Set">Meeting Set</option>
                                        <option value="Ghosted">Ghosted</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleAddContact} disabled={!newContact.name || !newContact.company}>Save Contact</Button>
                                    <Button variant="ghost" onClick={() => setIsAddingContact(false)}>Cancel</Button>
                                </div>
                            </Card>
                        )}

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredContacts.map(contact => (
                                <div key={contact.id} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{contact.name}</h3>
                                            <p className="text-slate-500 text-sm">{contact.role} @ {contact.company}</p>
                                        </div>
                                        <StatusBadge status={contact.status} />
                                    </div>

                                    <div className="flex gap-3 text-sm text-slate-400 mt-4">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> Last: {format(new Date(contact.lastContactDate || new Date()), 'MMM d')}</span>
                                        {contact.link && <a href={contact.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600"><ExternalLink size={14} /> Profile</a>}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                                        <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                                            setGenName(contact.name);
                                            setGenCompany(contact.company);
                                            setGenRole(contact.role);
                                            setActiveTab('generator');
                                        }}>
                                            <Mail size={16} className="mr-2" /> Draft Email
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600" onClick={() => deleteContact(contact.id)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {filteredContacts.length === 0 && !isAddingContact && (
                                <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                                    <p>No contacts found. Start building your network!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'generator' && (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <Card className="p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                                    Enter Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Recruiter/Peer Name</label>
                                        <input
                                            className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                            value={genName}
                                            onChange={e => setGenName(e.target.value)}
                                            placeholder="e.g. Sarah Smith"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company</label>
                                        <input
                                            className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                            value={genCompany}
                                            onChange={e => setGenCompany(e.target.value)}
                                            placeholder="e.g. Acme Corp"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role / Connection</label>
                                        <input
                                            className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                            value={genRole}
                                            onChange={e => setGenRole(e.target.value)}
                                            placeholder="e.g. Data Engineer"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Topic of Interest</label>
                                        <input
                                            className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                            value={genTopic}
                                            onChange={e => setGenTopic(e.target.value)}
                                            placeholder="e.g. their migration to Snowflake"
                                        />
                                    </div>
                                    <Button className="w-full" onClick={handleGenerateEmail} disabled={!genName || !genCompany}>
                                        Generate Draft
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="p-6 h-full flex flex-col">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">2</span>
                                    Your Draft
                                </h3>
                                {generatedEmail ? (
                                    <div className="flex-1 flex flex-col">
                                        <textarea
                                            className="flex-1 w-full p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500"
                                            value={generatedEmail}
                                            onChange={e => setGeneratedEmail(e.target.value)}
                                        />
                                        <div className="mt-4 flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setGeneratedEmail('')}>Clear</Button>
                                            <Button onClick={handleCopy} className={copied ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
                                                {copied ? <Check size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
                                                {copied ? 'Copied!' : 'Copy to Clipboard'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                        <Mail size={48} className="mb-4 opacity-20" />
                                        <p>Fill in the details to generate a message.</p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </WindowFrame>
    );
};
