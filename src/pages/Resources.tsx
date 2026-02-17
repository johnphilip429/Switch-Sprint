import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Card, Button } from '../components/ui';
import { ExternalLink, Plus, Save } from 'lucide-react';
import type { ResourceCategory, ResourceLink } from '../types';

export const Resources: React.FC = () => {
    const { state, updateResources } = useAppStore();
    const [editing, setEditing] = useState(false);
    const [localResources, setLocalResources] = useState<ResourceCategory[]>(state.resources);

    const handleSave = () => {
        updateResources(localResources);
        setEditing(false);
    };

    const handleAddLink = (catId: string) => {
        setLocalResources(prev => prev.map(cat => {
            if (cat.id !== catId) return cat;
            return {
                ...cat,
                links: [...cat.links, { id: crypto.randomUUID(), title: 'New Resource', url: 'https://', checked: false }]
            };
        }));
    };

    const updateLink = (catId: string, linkId: string, updates: Partial<ResourceLink>) => {
        setLocalResources(prev => prev.map(cat => {
            if (cat.id !== catId) return cat;
            return {
                ...cat,
                links: cat.links.map(l => l.id === linkId ? { ...l, ...updates } : l)
            };
        }));
    };

    const deleteLink = (catId: string, linkId: string) => {
        setLocalResources(prev => prev.map(cat => {
            if (cat.id !== catId) return cat;
            return {
                ...cat,
                links: cat.links.filter(l => l.id !== linkId)
            };
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Learning Resources</h1>
                    <p className="text-slate-500">Curated links for your preparation.</p>
                </div>
                {editing ? (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => { setLocalResources(state.resources); setEditing(false); }}>Cancel</Button>
                        <Button variant="primary" onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                            <Save size={18} className="mr-2" /> Save Changes
                        </Button>
                    </div>
                ) : (
                    <Button variant="primary" onClick={() => setEditing(true)}>Edit Resources</Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {localResources.map(cat => (
                    <Card key={cat.id} className="h-full flex flex-col">
                        <h3 className="font-bold text-lg mb-4 border-b pb-2">{cat.title}</h3>
                        <div className="space-y-3 flex-1">
                            {cat.links.map(link => (
                                <div key={link.id} className="flex items-start gap-2 group">
                                    {editing ? (
                                        <div className="flex-1 space-y-2 pb-2 border-b border-dashed border-slate-200 dark:border-slate-800">
                                            <input
                                                value={link.title}
                                                onChange={e => updateLink(cat.id, link.id, { title: e.target.value })}
                                                className="w-full text-sm font-medium bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                            />
                                            <input
                                                value={link.url}
                                                onChange={e => updateLink(cat.id, link.id, { url: e.target.value })}
                                                className="w-full text-xs text-slate-500 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none font-mono"
                                            />
                                            <button onClick={() => deleteLink(cat.id, link.id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                                        </div>
                                    ) : (
                                        <>
                                            <ExternalLink size={16} className="mt-1 text-slate-400 flex-shrink-0" />
                                            <a href={link.url} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-indigo-600 hover:underline break-words">
                                                {link.title}
                                            </a>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        {editing && (
                            <Button variant="outline" size="sm" onClick={() => handleAddLink(cat.id)} className="mt-4 w-full border-dashed">
                                <Plus size={16} className="mr-2" /> Add Link
                            </Button>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};
