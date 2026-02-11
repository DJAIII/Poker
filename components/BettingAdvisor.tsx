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
        // 안전한 숫자 변환
        const pSize = Number(potSize) || 0;
        const callAmt = Number(toCall) || 0;
        const wRate = Number(winRate) || 0;

        // 필수 값 체크 (0 이하일 경우 계산 보류)
        if (pSize <= 0 || callAmt <= 0) return null;

        const potOdds = (callAmt / (pSize + callAmt)) * 100;
        const winProb = wRate / 100;
        const loseProb = 1 - winProb;
        const ev = (winProb * pSize) - (loseProb * callAmt);

        let recommendation = "";
        let reason = "";
        let type: 'raise' | 'call' | 'fold' | 'bluff' = 'fold';

        if (wRate > 70) {
            recommendation = "강력한 레이즈";
            type = 'raise';
            reason = `승률이 매우 높습니다. 밸류 벳을 통해 이익을 극대화하세요.`;
        } else if (wRate > potOdds) {
            recommendation = "콜 (Call)";
            type = 'call';
            reason = `승률(${wRate.toFixed(1)}%)이 팟 오즈(${potOdds.toFixed(1)}%)보다 높아 장기적으로 이익입니다.`;
        } else {
            recommendation = "폴드 (Fold)";
            type = 'fold';
            reason = `승률이 팟 오즈보다 낮아 기대 수익이 마이너스입니다.`;
        }

        return {
            recommendation,
            reason,
            type,
            ev,
            potOdds
        };
    }, [winRate, potSize, toCall]);

    // 조언 데이터가 없을 때 표시할 안내 문구
    if (!advice) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500 italic border-t border-white/5 mt-4">
                <Calculator className="mb-2 opacity-20" size={32} />
                <p className="text-sm">팟 사이즈와 콜 비용을 입력하세요</p>
            </div>
        );
    }

    return (
        <div className={cn(
            "border rounded-xl p-6 shadow-xl transition-all duration-500",
            advice.type === 'raise' ? "bg-emerald-950/50 border-emerald-500/50" :
                advice.type === 'call' ? "bg-blue-950/50 border-blue-500/50" :
                    "bg-rose-950/50 border-rose-500/50"
        )}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className={cn(
                        "text-2xl font-bold uppercase tracking-tight",
                        advice.type === 'raise' ? "text-emerald-400" :
                            advice.type === 'call' ? "text-blue-400" :
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
                            "bg-rose-500/20 text-rose-400"
                )}>
                    {advice.type === 'raise' ? <ThumbsUp size={24} /> :
                        advice.type === 'call' ? <ArrowRight size={24} /> :
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
