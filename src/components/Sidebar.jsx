import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    History,
    Settings,
    ChevronLeft,
    ChevronRight,
    Activity,
    ShieldCheck,
    X
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${active
            ? 'bg-hospital-teal text-white glow-teal'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
            }`}
    >
        <Icon className={`w-5 h-5 shrink-0 ${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
        {!collapsed && (
            <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-medium whitespace-nowrap"
            >
                {label}
            </motion.span>
        )}
    </button>
);

const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
    const [collapsed, setCollapsed] = useState(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        // Close sidebar on mobile after selecting a tab
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: collapsed ? 80 : 280,
                    x: isSidebarOpen || window.innerWidth >= 1024 ? 0 : -280
                }}
                className="glass h-screen fixed lg:sticky top-0 flex flex-col p-4 z-50"
            >
                {/* Brand */}
                <div className="flex items-center gap-3 px-2 mb-10 overflow-hidden">
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-2 bg-hospital-teal rounded-lg glow-teal">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col"
                        >
                            <span className="text-xl font-bold tracking-tight text-white">MediLink <span className="text-hospital-teal">AI</span></span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Consultation Hub</span>
                        </motion.div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={() => handleTabClick('dashboard')}
                        collapsed={collapsed}
                    />
                    <SidebarItem
                        icon={History}
                        label="History"
                        active={activeTab === 'history'}
                        onClick={() => handleTabClick('history')}
                        collapsed={collapsed}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        active={activeTab === 'settings'}
                        onClick={() => handleTabClick('settings')}
                        collapsed={collapsed}
                    />
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-800/50">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        {collapsed ? <ChevronRight /> : <ChevronLeft />}
                    </button>
                </div>

                <div className="mt-4 flex items-center gap-3 px-2">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-hospital-teal" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white">Admin Portal</span>
                            <span className="text-[10px] text-green-500 uppercase font-bold tracking-tighter">Verified Session</span>
                        </div>
                    )}
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
