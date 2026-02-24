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
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${active
            ? 'bg-slate-800/80 text-white font-medium'
            : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
    >
        <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-hospital-teal' : 'group-hover:text-slate-300'} transition-colors`} />
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
                className="bg-[#09090b] border-r border-white/5 h-screen fixed lg:sticky top-0 flex flex-col p-4 z-50"
            >
                {/* Brand */}
                <div className="flex items-center gap-3 px-2 mb-10 overflow-hidden">
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-1.5 bg-slate-800 border border-white/10 rounded-md">
                        <Activity className="w-5 h-5 text-hospital-teal" />
                    </div>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col"
                        >
                            <span className="text-lg font-semibold tracking-tight text-white">MediLink <span className="text-hospital-teal">AI</span></span>
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

                <div className="mt-4 flex items-center gap-3 px-2 pt-2 border-t border-white/5">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-hospital-teal" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#09090b] rounded-full"></div>
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-white">Admin Portal</span>
                            <span className="text-[9px] text-green-500 font-medium">Verified Session</span>
                        </div>
                    )}
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
