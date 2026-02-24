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
    CloudRain
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
        setAgentStatus('Diagnostician is working...');

        try {
            // Simulate agent transition for better UX
            const pharmacistTransitionTimeout = setTimeout(() => {
                setAgentStatus('Pharmacist agent is reviewing...');
            }, 2500);

            const result = await consultationService.startAnalysis(patientNotes, existingMeds);

            clearTimeout(pharmacistTransitionTimeout);
            setCurrentResult(result);
            const newHistory = historyService.saveConsultation(result);
            setHistory(newHistory);
        } catch (error) {
            console.error(error);
            // Optionally add a subtle error status
            setAgentStatus('Error: Agent unavailable');
            setTimeout(() => setAgentStatus('Idle'), 5000);
        } finally {
            setIsLoading(false);
            if (agentStatus !== 'Error: Agent unavailable') {
                setAgentStatus('Idle');
            }
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
        <div className="min-h-screen flex bg-hospital-dark text-slate-100 font-sans selection:bg-slate-800">
            {/* Money Rain Effect */}
            <MoneyRain isActive={isRaining} onComplete={() => setIsRaining(false)} />

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <main className="flex-1 min-h-screen overflow-y-auto relative print:overflow-visible print:h-auto">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 bg-hospital-dark/80 backdrop-blur-md border-b border-white/5 print:hidden">
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
                                className="w-80 bg-slate-900 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:border-slate-700 outline-none transition-all placeholder:text-slate-500"
                            />
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Live Agent Status */}
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/5 text-xs font-medium">
                            <div className={`w-2 h-2 rounded-full ${agentStatus !== 'Idle' ? 'bg-hospital-teal animate-pulse' : 'bg-slate-500'}`}></div>
                            <span className={agentStatus !== 'Idle' ? 'text-hospital-teal' : 'text-slate-400'}>
                                {agentStatus !== 'Idle' ? agentStatus : 'Agents Ready'}
                            </span>
                        </div>

                        <div className="h-8 w-[1px] bg-slate-800 mx-2 hidden md:block"></div>

                        {/* Make it Rain Button - Hidden on Mobile */}
                        <button
                            onClick={() => setIsRaining(true)}
                            disabled={isRaining}
                            className={`hidden md:flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isRaining
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-slate-100 text-slate-900 hover:bg-white active:scale-95'
                                }`}
                            title="Make it rain!"
                        >
                            <CloudRain className={`w-5 h-5 ${!isRaining && 'group-hover:animate-bounce'}`} />
                            <span className="hidden lg:inline">Make it Rain</span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-800 mx-2 hidden md:block"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-slate-200">Dr. Casido</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-300">
                                C
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-4 md:p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {!currentResult ? (
                                    <div className="py-4 md:py-6">
                                        <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
                                            <div>
                                                <h1 className="text-3xl md:text-3xl font-semibold text-slate-100 mb-1 lg:tracking-tight">Welcome Back</h1>
                                                <p className="text-slate-500 text-sm">Enter the clinical details below to start a new diagnostic session.</p>
                                            </div>
                                            <div className="hidden lg:flex items-center gap-3 p-3 surface rounded-xl">
                                                <div className="p-1.5 bg-green-500/10 rounded-md">
                                                    <UserCheck className="w-4 h-4 text-green-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-medium text-slate-500 uppercase">System Status</p>
                                                    <p className="text-xs font-medium text-slate-300">Operational</p>
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
                                    <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                                        <HistoryIcon className="w-5 h-5 text-slate-400" />
                                        Consultation History
                                    </h2>
                                    <button
                                        onClick={() => { historyService.clearHistory(); setHistory([]); }}
                                        className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        Clear History
                                    </button>
                                </div>

                                {history.length === 0 ? (
                                    <div className="surface border-dashed p-16 flex flex-col items-center justify-center text-center">
                                        <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                                            <Clock className="w-8 h-8 text-slate-500" />
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-300">No consultations yet</h3>
                                        <p className="text-slate-500 text-sm mt-1">Previous diagnostic reports will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {history.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                whileHover={{ y: -2 }}
                                                onClick={() => selectHistoryItem(item)}
                                                className="surface p-5 cursor-pointer hover:border-slate-700 transition-all group"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="text-xs font-medium text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                                                    <div className="text-[10px] font-medium text-slate-400 border border-white/5 px-2 py-0.5 rounded-full">
                                                        Verified
                                                    </div>
                                                </div>
                                                <h4 className="text-base font-medium text-slate-200 group-hover:text-slate-100 transition-colors line-clamp-1">{item.diagnosis}</h4>
                                                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.rationale}</p>
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
                                className="max-w-2xl mx-auto surface p-8 text-center"
                            >
                                <SettingsIcon className="w-10 h-10 text-slate-500 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-slate-200">System Settings</h2>
                                <p className="text-slate-500 text-sm mt-1">Configuration module is restricted to administrators.</p>
                                <div className="mt-8 p-0 text-left divide-y divide-white/5 border border-white/5 rounded-xl overflow-hidden bg-slate-900/30">
                                    <div className="flex justify-between items-center p-4">
                                        <span className="text-sm text-slate-400">Base Endpoint</span>
                                        <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-1 rounded">medilinkaiservice-production...</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4">
                                        <span className="text-sm text-slate-400">Network Status</span>
                                        <span className="text-xs font-medium flex items-center gap-1.5 text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            Connected
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-4">
                                        <span className="text-sm text-slate-400">Storage Mode</span>
                                        <span className="text-sm font-medium text-slate-300">LocalStorage</span>
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
