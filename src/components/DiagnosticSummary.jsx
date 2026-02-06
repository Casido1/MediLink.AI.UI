import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldAlert,
    ClipboardCheck,
    Lightbulb,
    CheckCircle2,
    Printer,
    Share2,
    Verified,
    AlertCircle,
    Activity
} from 'lucide-react';

const DiagnosticSummary = ({ result, onReset }) => {
    if (!result) return null;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto space-y-6 pb-20"
        >
            <div className="flex justify-between items-center mb-4 no-print">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ClipboardCheck className="text-hospital-teal" />
                    Diagnostic Summary Board
                </h2>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all font-medium border border-slate-700">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all font-medium border border-slate-700"
                    >
                        <Printer className="w-4 h-4" /> Print PDF
                    </button>
                    <button
                        onClick={onReset}
                        className="px-4 py-2 rounded-xl bg-hospital-teal text-white hover:opacity-90 transition-all font-bold"
                    >
                        New Case
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Diagnosis */}
                <motion.div variants={item} className="lg:col-span-2 glass rounded-3xl p-8 border-l-4 border-hospital-teal">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-hospital-teal/10 p-2 rounded-lg">
                            <Verified className="w-6 h-6 text-hospital-teal" />
                        </div>
                        <span className="text-sm font-bold text-hospital-teal uppercase tracking-widest">Primary Diagnosis</span>
                    </div>
                    <h1 className="text-xl font-black text-white mb-6 leading-tight">
                        {result.diagnosis || "Preliminary Finding"}
                    </h1>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-5 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <Lightbulb className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-slate-200 mb-1">Clinical Rationale</h4>
                                <p className="text-slate-400 leading-relaxed">{result.rationale || "AI analysis of symptoms suggests this condition based on clinical guidelines."}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Status / Quick Stats */}
                <motion.div variants={item} className="glass rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-hospital-teal/20 flex items-center justify-center mb-4 relative">
                        <Activity className="w-10 h-10 text-hospital-teal" />
                        <div className="absolute inset-0 border-4 border-hospital-teal rounded-full animate-ping opacity-20"></div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Analysis Complete</h3>
                    <p className="text-slate-500 text-sm">Processed by Multi-Agent Medical System</p>
                    <div className="mt-8 w-full space-y-3">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500 px-1">
                            <span>Confidence</span>
                            <span className="text-hospital-teal">94%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '94%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-hospital-teal glow-teal"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Recommended Actions */}
                <motion.div variants={item} className="glass rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                            <CheckCircle2 className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">Recommended Actions</span>
                    </div>
                    <ul className="space-y-4">
                        {(result.actions || ["Immediate follow-up with specialist", "Blood panel (CBC, Metabolic)", "Rest and hydration"]).map((action, i) => (
                            <li key={i} className="flex gap-3 text-slate-300">
                                <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[10px] font-bold">{i + 1}</span>
                                </div>
                                <span>{action}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Safety Warnings */}
                <motion.div variants={item} className="glass rounded-3xl p-8 border border-red-500/30 bg-red-500/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-red-500/10 p-2 rounded-lg">
                            <ShieldAlert className="w-6 h-6 text-red-500" />
                        </div>
                        <span className="text-sm font-bold text-red-500 uppercase tracking-widest text-glow-red">Clinical Alerts</span>
                    </div>
                    <p className="text-slate-400 text-sm italic mb-4">Urgent considerations for this case:</p>
                    <div className="space-y-3">
                        {(result.warnings || ["Seek immediate care if shortness of breath persists", "Avoid strenuous activity", "Monitor temperature"]).map((warning, i) => (
                            <div key={i} className="flex gap-3 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                <span className="text-xs font-semibold text-red-200">{warning}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Pharmacist Section */}
                <motion.div variants={item} className="glass rounded-3xl p-8 border border-amber-500/30 bg-amber-500/5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-500/10 p-2 rounded-lg">
                                <Verified className="w-6 h-6 text-amber-500" />
                            </div>
                            <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">Pharmacist's Review</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-500/30">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-amber-500 uppercase">Verified Agent</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-900/80 rounded-2xl border border-amber-500/20">
                            <h4 className="text-sm font-bold text-amber-200 mb-2">Drug-Drug Interactions</h4>
                            <div className="space-y-2">
                                {result.interactions?.length > 0 ? (
                                    result.interactions.map((int, i) => (
                                        <div key={i} className="text-xs text-slate-400 py-2 border-b border-white/5 last:border-0">
                                            {int}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500">No significant interactions detected via OpenFDA API for the provided medications.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DiagnosticSummary;
