import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FilePlus,
    History,
    Settings,
    ChevronLeft,
    ChevronRight,
    Upload,
    Activity,
    ShieldCheck,
    X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { consultationService } from '../services/apiService';

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
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const loadingToast = toast.loading('Uploading medical knowledge...');

        try {
            await consultationService.uploadKnowledge(file);
            toast.success('Knowledge ingested successfully!', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to upload knowledge. Please try again.', { id: loadingToast });
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

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

                {/* Knowledge Ingestion Portal */}
                <div className="mt-auto pt-6 border-t border-slate-800/50">
                    {!collapsed && (
                        <div className="mb-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Knowledge Portal</h4>
                            <label className={`
              flex flex-col items-center justify-center w-full h-32 
              border-2 border-dashed border-slate-700 rounded-2xl 
              cursor-pointer hover:border-hospital-teal/50 hover:bg-hospital-teal/5 
              transition-all group relative overflow-hidden
              ${isUploading ? 'pointer-events-none opacity-50' : ''}
            `}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-hospital-teal mb-2 transition-colors" />
                                    <p className="text-sm text-slate-400 group-hover:text-slate-300">
                                        <span className="font-semibold">Click to upload</span>
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-1">PDF, DOCX or TXT</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" />

                                {isUploading && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute bottom-0 left-0 h-1 bg-hospital-teal"
                                    />
                                )}
                            </label>
                        </div>
                    )}

                    {collapsed && (
                        <button
                            onClick={() => setCollapsed(false)}
                            className="w-full flex items-center justify-center p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                        >
                            <Upload className="w-5 h-5" />
                        </button>
                    )}

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
