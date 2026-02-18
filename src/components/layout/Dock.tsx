import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, GraduationCap, BarChart3, FolderOpen, Mic2, Users, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip } from '../ui/Tooltip'; // We might need to create a simple tooltip or just use title attribute

const DOCK_ITEMS = [
    { icon: LayoutDashboard, label: 'Mission Control', path: '/' },
    { icon: Briefcase, label: 'Career Canvas', path: '/applications' },
    { icon: GraduationCap, label: 'Brain Kernel', path: '/study' },
    { icon: Mic2, label: 'The Dojo', path: '/interview' },
    { icon: Users, label: 'Connection Hub', path: '/networking' },
    { icon: FileText, label: 'Portfolio', path: '/resumes' },
    { icon: FolderOpen, label: 'Infinite Scroll', path: '/resources' },
    { icon: BarChart3, label: 'Quantified Self', path: '/analytics' },
];

export const Dock: React.FC = () => {
    return (
        <div className="fixed bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white/20 dark:bg-black/40 backdrop-blur-2xl border border-white/20 px-4 py-3 rounded-2xl md:rounded-3xl shadow-2xl flex items-end gap-2 md:gap-4 transition-all duration-300 hover:scale-105">
                {DOCK_ITEMS.map((item) => (
                    <Tooltip key={item.path} content={item.label}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => cn(
                                "relative w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 group hover:-translate-y-2",
                                isActive
                                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-110"
                                    : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white hover:shadow-md"
                            )}
                        >
                            <item.icon size={20} className="md:w-6 md:h-6" />
                            {/* Active Indicator Dot */}
                            <span className={cn(
                                "absolute -bottom-2 w-1 h-1 rounded-full bg-white/50 transition-all",
                                // isActive ? "opacity-100" : "opacity-0"
                            )} />
                        </NavLink>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
};
