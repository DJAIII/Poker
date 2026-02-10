import React, { useMemo } from 'react';
import { SimulationResult } from '@/lib/types';
import { Calculator, ArrowRight, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BettingAdvisorProps {
    winRate: number; // Percentage 0-100
    potSize: number;
    toCall: number;
}

const BettingAdvisor: React.FC<BettingAdvisorProps> = ({ winRate, potSize, toCall }) => {

    const advice = useMemo(() => {
        // Basic validations
        if (potSize <= 0 || toCall <= 0) return null;

        const potOdds = (toCall / (potSize + toCall)) * 100;
        // Expected Value: (Win% * Pot) - (Lose% * Call)
        // Actually, simple Pot Odds comparison is easier:
        // If Win% > Pot Odds, it's +EV.

        // EV Calculation for display
        // Win Payout = Pot Size
        // Cost = To Call
        // EV = (Win% * PotSize) - (Lose% * ToCall)
        const winProb = winRate / 100;
        const loseProb = 1 - winProb;
        const ev = (winProb * potSize) - (loseProb * toCall);

        let recommendation = "";
        let reason = "";
        let type: 'raise' | 'call' | 'fold' | 'bluff' = 'fold';

        if (winRate > 70) {
            recommendation = "강력한 레이즈 (Strong Raise)";
            type = 'raise';
            reason = `승률(${winRate}%)이 매우 높습니다. 밸류 벳을 통해 이익을 극대화하세요.`;
        } else if (winRate > potOdds) {
            recommendation = "콜 (Call)";
            type = 'call';
            reason = `승률(${winRate}%)이 팟 오즈(${potOdds.toFixed(1)}%)보다 높습니다. 장기적으로 이익(+EV)인 콜입니다.`;
        } else if (winRate > potOdds * 0.8) { // Slightly loose definition for bluff/draw potential
            recommendation = "폴드 또는 블러핑 (Fold / Bluff)";
            type = 'bluff';
            reason = `승률(${winRate}%)이 팟 오즈(${potOdds.toFixed(1)}%)보다 낮지만, 개선 가능성이 있다면 고려해볼 수 있습니다.`;
        } else {
            recommendation = "폴드 (Fold)";
            type = 'fold';
            reason = `승률(${winRate}%)이 팟 오즈(${potOdds.toFixed(1)}%)보다 낮아 기대 수익(-EV)이 마이너스입니다.`;
        }

        return {
            recommendation,
            reason,
            type,
            ev,
            potOdds
        };
    }, [winRate, potSize, toCall]);

    if (!advice) {
        return (
            <div className="bg-slate-900 border border-white/10 rounded-xl p-6 text-center text-slate-400 text-sm">
                <Calculator className="mx-auto mb-2 opacity-50" />
                팟 사이즈와 콜 비용을 입력하여 베팅 조언을 받으세요.
            </div>
        );
    }

    return (
        <div className={cn(
            "border rounded-xl p-6 shadow-xl transition-all duration-500",
            advice.type === 'raise' ? "bg-emerald-950/50 border-emerald-500/50" :
                advice.type === 'call' ? "bg-blue-950/50 border-blue-500/50" :
                    advice.type === 'bluff' ? "bg-amber-950/50 border-amber-500/50" :
                        "bg-rose-950/50 border-rose-500/50"
        )}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className={cn(
                        "text-2xl font-bold uppercase tracking-tight",
                        advice.type === 'raise' ? "text-emerald-400" :
                            advice.type === 'call' ? "text-blue-400" :
                                advice.type === 'bluff' ? "text-amber-400" :
                                    "text-rose-400"
                    )}>
                        {advice.recommendation}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                            "text-xs font-mono px-2 py-0.5 rounded-full border",
                            advice.ev > 0
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                        )}>
                            EV: {advice.ev > 0 ? '+' : ''}{advice.ev.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400">
                            Pot Odds: {advice.potOdds.toFixed(1)}%
                        </span>
                    </div>
                </div>
                <div className={cn(
                    "p-3 rounded-full",
                    advice.type === 'raise' ? "bg-emerald-500/20 text-emerald-400" :
                        advice.type === 'call' ? "bg-blue-500/20 text-blue-400" :
                            advice.type === 'bluff' ? "bg-amber-500/20 text-amber-400" :
                                "bg-rose-500/20 text-rose-400"
                )}>
                    {advice.type === 'raise' ? <ThumbsUp size={24} /> :
                        advice.type === 'call' ? <ArrowRight size={24} /> :
                            advice.type === 'bluff' ? <AlertCircle size={24} /> :
                                <ThumbsDown size={24} />}
                </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                {advice.reason}
            </p>

        </div>
    );
};

export default BettingAdvisor;
