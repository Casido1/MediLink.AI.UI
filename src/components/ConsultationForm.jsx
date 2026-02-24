import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Activity, Pill, User } from 'lucide-react';

const ConsultationForm = ({ onStartAnalysis, isLoading, agentStatus }) => {
    const [patientNotes, setPatientNotes] = useState('');
    const [existingMeds, setExistingMeds] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!patientNotes.trim()) return;
        onStartAnalysis(patientNotes, existingMeds);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface p-6 md:p-8 max-w-4xl mx-auto"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="p-2.5 bg-slate-800 border border-white/10 rounded-xl">
                    <Activity className="w-6 h-6 text-hospital-teal" />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-slate-100 tracking-tight">New Consultation</h2>
                    <p className="text-slate-500 text-sm">Provide patient details for AI-powered diagnostic analysis.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-1">
                            <User className="w-4 h-4 text-slate-500" />
                            Patient Symptoms & Clinical Notes
                        </label>
                        <textarea
                            required
                            value={patientNotes}
                            onChange={(e) => setPatientNotes(e.target.value)}
                            placeholder="e.g., Patient reports severe fatigue, joint pain, and a persistent dry cough for 3 weeks..."
                            className="w-full h-48 bg-slate-900 border border-white/5 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:border-slate-700 outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-1">
                            <Pill className="w-4 h-4 text-slate-500" />
                            Current Medications
                        </label>
                        <textarea
                            value={existingMeds}
                            onChange={(e) => setExistingMeds(e.target.value)}
                            placeholder="e.g., Lisinopril 10mg daily, Metformin 500mg daily..."
                            className="w-full h-48 bg-slate-900 border border-white/5 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:border-slate-700 outline-none transition-all resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading || !patientNotes.trim()}
                        className={`
              relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all overflow-hidden
              ${isLoading
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-slate-100 text-slate-900 hover:bg-white active:scale-95 group'}
            `}
                    >
                        {isLoading ? (
                            <>
                                <div className="h-4 w-4 border-2 border-slate-500/30 border-t-slate-400 rounded-full animate-spin shrink-0" />
                                <span className="truncate max-w-[200px]">{agentStatus !== 'Idle' ? agentStatus : 'Analysing Data...'}</span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4 text-slate-900" />
                                <span>Start Diagnostic Analysis</span>
                                <Send className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-slate-900" />
                            </>
                        )}

                        <AnimatePresence>
                            {isLoading && (
                                <motion.div
                                    initial={{ left: '-100%' }}
                                    animate={{ left: '100%' }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                />
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default ConsultationForm;
