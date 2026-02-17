import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Briefcase, GraduationCap, BarChart3, Menu, FolderOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Briefcase, label: 'Applications', path: '/applications' },
    { icon: GraduationCap, label: 'Study Plan', path: '/study' },
    { icon: FolderOpen, label: 'Resources', path: '/resources' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    // { icon: Settings, label: 'Settings', path: '/settings' },
];

export const AppLayout: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex text-slate-900 dark:text-slate-100 font-sans">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 fixed h-full">
                <div className="flex items-center gap-2 px-2 mb-8">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">SS</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">SwitchSprint</h1>
                </div>

                <nav className="flex flex-col gap-1 flex-1">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                                isActive
                                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                            )}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="text-xs text-slate-400 mt-auto px-2">
                    SwitchSprint v1.0
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">SS</span>
                        </div>
                        <h1 className="font-bold">SwitchSprint</h1>
                    </div>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                        <Menu size={24} />
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-20 bg-slate-800/50" onClick={() => setMobileMenuOpen(false)}>
                        <div className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-950 p-4 shadow-xl" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold">Menu</h2>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2">✕</button>
                            </div>
                            <nav className="flex flex-col gap-2">
                                {NAV_ITEMS.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) => clsx(
                                            "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium",
                                            isActive
                                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                                                : "text-slate-600 dark:text-slate-400"
                                        )}
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
