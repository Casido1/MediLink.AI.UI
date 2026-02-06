import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    History as HistoryIcon,
    Settings as SettingsIcon,
    Search,
    Cpu,
    UserCheck,
    Clock,
    Menu,
    DollarSign
} from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import ConsultationForm from './components/ConsultationForm';
import DiagnosticSummary from './components/DiagnosticSummary';
import MoneyRain from './components/MoneyRain';

// Services
import { consultationService } from './services/apiService';
import { historyService } from './services/historyService';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(false);
    const [currentResult, setCurrentResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [agentStatus, setAgentStatus] = useState('Idle');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isRaining, setIsRaining] = useState(false);

    useEffect(() => {
        setHistory(historyService.getHistory());
    }, []);

    const handleStartAnalysis = async (patientNotes, existingMeds) => {
        setIsLoading(true);
        setAgentStatus('Diagnostician Thinking...');
        const loadingToast = toast.loading('Consulting Digital Diagnostician...');

        try {
            // Simulate multiple agent stages for "WOW" factor
            setTimeout(() => setAgentStatus('Pharmacist Reviewing Drugs...'), 2000);

            const result = await consultationService.startAnalysis(patientNotes, existingMeds);

            toast.success('Analysis complete!', { id: loadingToast });
            setCurrentResult(result);
            const newHistory = historyService.saveConsultation(result);
            setHistory(newHistory);
        } catch (error) {
            toast.error('Diagnostic error. The agents are currently unavailable.', { id: loadingToast });
            console.error(error);
        } finally {
            setIsLoading(false);
            setAgentStatus('Idle');
        }
    };

    const handleReset = () => {
        setCurrentResult(null);
        setActiveTab('dashboard');
    };

    const selectHistoryItem = (item) => {
        setCurrentResult(item);
        setActiveTab('dashboard');
    };

    return (
        <div className="min-h-screen flex bg-hospital-dark text-slate-100 font-sans selection:bg-hospital-teal/30">
            {/* Money Rain Effect */}
            <MoneyRain isActive={isRaining} onComplete={() => setIsRaining(false)} />

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <main className="flex-1 h-screen overflow-y-auto relative">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 glass border-b border-slate-800/50">
                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Mobile Hamburger Menu */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Search history or clinical data..."
                                className="w-80 bg-slate-900/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-hospital-teal outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Live Agent Status */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
                            <div className="relative">
                                <Cpu className={`w-5 h-5 ${agentStatus !== 'Idle' ? 'text-hospital-teal animate-pulse' : 'text-slate-500'}`} />
                                {agentStatus !== 'Idle' && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-hospital-teal rounded-full animate-ping"></div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">AI Agent Status</span>
                                <span className={`text-xs font-bold ${agentStatus !== 'Idle' ? 'text-hospital-teal' : 'text-slate-400'}`}>
                                    {agentStatus}
                                </span>
                            </div>
                        </div>

                        <div className="h-8 w-[1px] bg-slate-800 mx-2 hidden md:block"></div>

                        {/* Make it Rain Button - Hidden on Mobile */}
                        <button
                            onClick={() => setIsRaining(true)}
                            disabled={isRaining}
                            className={`hidden md:flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-bold transition-all ${isRaining
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-500 hover:scale-105 active:scale-95'
                                }`}
                            title="Make it rain!"
                        >
                            <DollarSign className={`w-5 h-5 ${!isRaining && 'group-hover:animate-bounce'}`} />
                            <span className="hidden lg:inline">Make it Rain</span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-800 mx-2 hidden md:block"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold">Dr. Casido</p>
                                <p className="text-[10px] text-hospital-teal font-black uppercase tracking-widest">Chief Medical Officer</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hospital-teal to-blue-600 flex items-center justify-center font-bold text-white shadow-lg glow-teal">
                                C
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {!currentResult ? (
                                    <div className="py-12">
                                        <div className="max-w-4xl mx-auto mb-12 flex items-center justify-between">
                                            <div>
                                                <h1 className="text-4xl font-black text-white mb-2">Welcome Back, 👋</h1>
                                                <p className="text-slate-400">Ready for a new diagnostic session? Enter the clinical details below.</p>
                                            </div>
                                            <div className="hidden lg:flex items-center gap-4 p-4 glass rounded-2xl">
                                                <div className="p-2 bg-green-500/20 rounded-lg">
                                                    <UserCheck className="w-6 h-6 text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase">System Integrity</p>
                                                    <p className="text-sm font-bold text-white">All agents operational</p>
                                                </div>
                                            </div>
                                        </div>
                                        <ConsultationForm onStartAnalysis={handleStartAnalysis} isLoading={isLoading} />
                                    </div>
                                ) : (
                                    <DiagnosticSummary result={currentResult} onReset={handleReset} />
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'history' && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-5xl mx-auto"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                        <HistoryIcon className="text-hospital-teal" />
                                        Consultation History
                                    </h2>
                                    <button
                                        onClick={() => { historyService.clearHistory(); setHistory([]); }}
                                        className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
                                    >
                                        Clear All History
                                    </button>
                                </div>

                                {history.length === 0 ? (
                                    <div className="glass rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                                        <div className="p-6 bg-slate-800 rounded-full mb-6">
                                            <Clock className="w-12 h-12 text-slate-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-300">No consultations yet</h3>
                                        <p className="text-slate-500 mt-2">Previous diagnostic reports will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {history.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                onClick={() => selectHistoryItem(item)}
                                                className="glass p-6 rounded-2xl cursor-pointer border border-transparent hover:border-hospital-teal/30 hover:bg-hospital-teal/5 transition-all group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="bg-hospital-dark/50 px-3 py-1 rounded-full border border-slate-800">
                                                        <span className="text-[10px] font-bold text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="text-[10px] font-black uppercase text-hospital-teal tracking-tighter px-2 py-0.5 bg-hospital-teal/10 rounded-sm">
                                                        Verified
                                                    </div>
                                                </div>
                                                <h4 className="text-lg font-bold text-white group-hover:text-hospital-teal transition-colors line-clamp-1">{item.diagnosis}</h4>
                                                <p className="text-sm text-slate-400 line-clamp-2 mt-2">{item.rationale}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="max-w-3xl mx-auto glass rounded-3xl p-12 text-center"
                            >
                                <SettingsIcon className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                                <h2 className="text-2xl font-bold text-white">System Settings</h2>
                                <p className="text-slate-400 mt-2 italic">Configuration module is restricted to administrators.</p>
                                <div className="mt-10 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-left">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">API Configuration</h4>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-800">
                                        <span className="text-sm">Base Endpoint</span>
                                        <span className="text-xs font-mono text-hospital-teal">medilinkaiservice-production...</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-800">
                                        <span className="text-sm">Network Status</span>
                                        <span className="text-xs font-bold text-green-500">Connected</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-sm">Storage Mode</span>
                                        <span className="text-xs font-bold text-blue-500">LocalStorage (Local-Only)</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

export default App;
