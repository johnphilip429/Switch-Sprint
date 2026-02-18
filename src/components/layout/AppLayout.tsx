import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Dock } from './Dock';
import { format } from 'date-fns';

export const AppLayout: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans text-slate-100 relative bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920)' }}>
            {/* Desktop Overlay Gradient */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-none"></div>

            {/* Top Menu Bar */}
            <div className="h-8 bg-black/40 backdrop-blur-md text-white/90 text-xs px-4 flex items-center justify-between z-50 relative shadow-sm font-medium">
                <div className="flex items-center gap-4">
                    <span>🍎</span>
                    <span className="font-bold">SwitchSprint</span>
                </div>
                <div className="flex items-center gap-3 opacity-80">
                    <span>{format(currentTime, 'EEE MMM d h:mm aa')}</span>
                </div>
            </div>

            {/* Main Content Area (Desktop) */}
            <main className="relative z-10 w-full h-[calc(100vh-32px)] p-4 md:p-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-[1600px] h-full pb-20 md:pb-24 transition-all duration-500 ease-in-out">
                    <Outlet />
                </div>
            </main>

            {/* Dock Navigation */}
            <Dock />
        </div>
    );
};
