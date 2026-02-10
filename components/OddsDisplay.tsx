import React from 'react';
import { SimulationResult } from '@/lib/types';
import { Trophy, Ban, RefreshCw, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OddsDisplayProps {
    result: SimulationResult;
}

const OddsDisplay: React.FC<OddsDisplayProps> = ({ result }) => {
    // Sort hand breakdown by likelihood
    const sortedBreakdown = Object.entries(result.handBreakdown || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6);

    return (
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-300">

            {/* Title */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">시뮬레이션 결과</h2>
                <div className="text-xs text-slate-500 font-mono">20,000 핸드</div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-8">

                {/* Win */}
                <div className="flex flex-col items-center p-3 bg-slate-800/50 rounded-lg border border-white/5">
                    <Trophy size={18} className="text-emerald-500 mb-2" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">승리</span>
                    <span className="text-base md:text-lg font-black text-white">{result.win}%</span>
                </div>

                {/* Tie */}
                <div className="flex flex-col items-center p-3 bg-slate-800/50 rounded-lg border border-white/5">
                    <RefreshCw size={18} className="text-sky-500 mb-2" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">무승부</span>
                    <span className="text-base md:text-lg font-black text-white">{result.tie}%</span>
                </div>

                {/* Lose */}
                <div className="flex flex-col items-center p-3 bg-slate-800/50 rounded-lg border border-white/5">
                    <Ban size={18} className="text-rose-500 mb-2" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">패배</span>
                    <span className="text-base md:text-lg font-black text-white">{result.lose}%</span>
                </div>
            </div>

            <div className="h-px bg-white/10 w-full mb-6" />

            {/* Hand Breakdown */}
            <div>
                <div className="flex items-center gap-2 mb-4 text-slate-300">
                    <BarChart size={16} />
                    <h3 className="text-sm font-bold uppercase tracking-wide">족보별 승리 확률</h3>
                </div>

                <div className="space-y-3">
                    {sortedBreakdown.length > 0 ? sortedBreakdown.map(([handType, probability]) => (
                        <div key={handType} className="group cursor-default">
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-slate-400 font-medium group-hover:text-emerald-400 transition-colors">{handType}</span>
                                <span className="font-mono text-slate-200">{probability}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-700 ease-out",
                                        probability > 15 ? "bg-emerald-500" :
                                            probability > 5 ? "bg-emerald-600" : "bg-emerald-800"
                                    )}
                                    style={{ width: `${Math.min(probability * 2.5, 100)}%` }} // Visual scaling
                                />
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-slate-500 text-xs py-4 italic">
                            시뮬레이션 데이터 없음.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default OddsDisplay;
