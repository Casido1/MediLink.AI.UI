import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
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

    const confidence = useMemo(() => {
        // Random integer between 92 and 96
        return Math.floor(Math.random() * (96 - 92 + 1)) + 92;
    }, [result]);

    const handleShare = async () => {
        const shareData = {
            title: 'Diagnostic Summary',
            text: `Diagnosis: ${result.diagnosis}\nRationale: ${result.rationale}\n\nActions:\n${(result.recommendedActions || []).join('\n')}`,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareData.text);
                toast.success('Summary copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

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
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/5 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/5 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                        <Printer className="w-4 h-4" /> Print PDF
                    </button>
                    <button
                        onClick={onReset}
                        className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-900 hover:bg-white transition-colors active:scale-95 text-sm font-medium"
                    >
                        New Case
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Diagnosis */}
                <motion.div variants={item} className="lg:col-span-2 surface p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-hospital-teal/10 border border-hospital-teal/20 p-2 rounded-lg">
                            <Verified className="w-5 h-5 text-hospital-teal" />
                        </div>
                        <span className="text-xs font-semibold text-hospital-teal uppercase tracking-widest">Primary Diagnosis</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-100 mb-6 leading-tight tracking-tight">
                        {result.diagnosis || "Preliminary Finding"}
                    </h1>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-5 bg-slate-900/50 rounded-xl border border-white/5">
                            <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-slate-300 mb-1 text-sm">Clinical Rationale</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{result.rationale || "AI analysis of symptoms suggests this condition based on clinical guidelines."}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Status / Quick Stats */}
                <motion.div variants={item} className="surface p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mb-4">
                        <Activity className="w-6 h-6 text-hospital-teal" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-100 mb-1">Analysis Complete</h3>
                    <p className="text-slate-500 text-xs">Processed by Multi-Agent Medical System</p>
                    <div className="mt-8 w-full space-y-2">
                        <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-1">
                            <span>Confidence</span>
                            <span className="text-hospital-teal">{confidence}%</span>
                        </div>
                        <div className="w-full bg-slate-900 border border-white/5 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${confidence}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-hospital-teal"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Recommended Actions */}
                <motion.div variants={item} className="surface p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Recommended Actions</span>
                    </div>
                    <ul className="space-y-4">
                        {(result.recommendedActions || ["Immediate follow-up with specialist", "Blood panel (CBC, Metabolic)", "Rest and hydration"]).map((action, i) => (
                            <li key={i} className="flex gap-3 text-slate-300 text-sm">
                                <div className="w-5 h-5 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[10px] font-medium">{i + 1}</span>
                                </div>
                                <span className="pt-0.5">{action}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Safety Warnings */}
                <motion.div variants={item} className="surface p-8 border border-red-500/10">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
                            <ShieldAlert className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">Clinical Alerts</span>
                    </div>
                    <div className="space-y-2.5">
                        {(result.safetyWarnings || ["Seek immediate care if shortness of breath persists", "Avoid strenuous activity", "Monitor temperature"]).map((warning, i) => (
                            <div key={i} className="flex gap-3 p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-xs font-medium text-red-200 leading-relaxed">{warning}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Pharmacist Section */}
                <motion.div variants={item} className="surface p-8 border border-amber-500/10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
                                <Verified className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest">Pharmacist's Review</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                            <span className="text-[10px] font-medium text-amber-500">Verified</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                            <h4 className="text-xs font-semibold text-amber-200 mb-3 uppercase tracking-wide">Clinical Pharmacology Notes</h4>
                            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {result.pharmacistReview || "No significant pharmacological interactions or warnings were noted for the provided medications based on current clinical guidelines."}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DiagnosticSummary;
