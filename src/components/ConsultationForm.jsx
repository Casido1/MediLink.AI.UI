import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Activity, Pill, User } from 'lucide-react';

const ConsultationForm = ({ onStartAnalysis, isLoading }) => {
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
            className="glass rounded-3xl p-8 max-w-4xl mx-auto"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-hospital-teal/20 rounded-2xl">
                    <Activity className="w-8 h-8 text-hospital-teal" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">New Consultation</h2>
                    <p className="text-slate-400">Provide patient details for AI-powered diagnostic analysis.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 ml-1">
                            <User className="w-4 h-4 text-hospital-teal" />
                            Patient Symptoms & Clinical Notes
                        </label>
                        <textarea
                            required
                            value={patientNotes}
                            onChange={(e) => setPatientNotes(e.target.value)}
                            placeholder="e.g., Patient reports severe fatigue, joint pain, and a persistent dry cough for 3 weeks..."
                            className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-hospital-teal outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 ml-1">
                            <Pill className="w-4 h-4 text-hospital-teal" />
                            Current Medications
                        </label>
                        <textarea
                            value={existingMeds}
                            onChange={(e) => setExistingMeds(e.target.value)}
                            placeholder="e.g., Lisinopril 10mg daily, Metformin 500mg daily..."
                            className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-hospital-teal outline-none transition-all resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading || !patientNotes.trim()}
                        className={`
              relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white transition-all overflow-hidden
              ${isLoading
                                ? 'bg-slate-700 cursor-not-allowed'
                                : 'bg-hospital-teal hover:scale-105 active:scale-95 glow-teal group'}
            `}
                    >
                        {isLoading ? (
                            <>
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Analysing Clinical Data...</span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                                <span>Start Diagnostic Analysis</span>
                                <Send className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
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
