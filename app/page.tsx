"use client";

import { useEffect, useState, useRef } from 'react';
import CardSelector from '@/components/CardSelector';
import PokerTable from '@/components/PokerTable';
import OddsDisplay from '@/components/OddsDisplay';
import BettingAdvisor from '@/components/BettingAdvisor';
import CardPickerModal from '@/components/CardPickerModal';
import { CardType, SimulationResult } from '@/lib/types';
import { calculateOdds } from '@/lib/poker-engine';
import { Loader2, RefreshCw } from 'lucide-react';

export default function Home() {
    const [holeCards, setHoleCards] = useState<(CardType | null)[]>([null, null]);
    const [communityCards, setCommunityCards] = useState<(CardType | null)[]>([null, null, null, null, null]);
    const [numOpponents, setNumOpponents] = useState<number>(1);
    const [activeSelection, setActiveSelection] = useState<'hole' | 'flop1' | 'flop2' | 'flop3' | 'turn' | 'river' | null>(null);
    const [calculating, setCalculating] = useState(false);
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [potSize, setPotSize] = useState<string>('');
    const [toCall, setToCall] = useState<string>('');
    const [editingSlot, setEditingSlot] = useState<{ type: 'hole' | 'community', index: number } | null>(null);

    // Track all selected cards to disable them in selector
    const allSelectedCards = [...holeCards, ...communityCards].filter((c): c is CardType => c !== null);

    const handleCardSelect = (card: CardType) => {
        // If card is already selected elsewhere, ignore
        if (allSelectedCards.some(c => c.rank === card.rank && c.suit === card.suit)) {
            return;
        }

        if (activeSelection === 'hole') {
            const index = holeCards.findIndex(c => c === null);
            if (index !== -1) {
                const newCards = [...holeCards];
                newCards[index] = card;
                setHoleCards(newCards);
            }
        } else if (activeSelection === 'flop1' || activeSelection === 'flop2' || activeSelection === 'flop3' || activeSelection === 'turn' || activeSelection === 'river') {
            // ... hande specific types if needed
        } else {
            // Auto-fill logic
            const holeIdx = holeCards.findIndex(c => c === null);
            if (holeIdx !== -1) {
                const newCards = [...holeCards];
                newCards[holeIdx] = card;
                setHoleCards(newCards);
            } else {
                const commIdx = communityCards.findIndex(c => c === null);
                if (commIdx !== -1) {
                    const newCards = [...communityCards];
                    newCards[commIdx] = card;
                    setCommunityCards(newCards);
                }
            }
        }

        // Reset result on change
        setResult(null);
    };

    const removeHoleCard = (index: number) => {
        const newCards = [...holeCards];
        newCards[index] = null;
        setHoleCards(newCards);
        setResult(null);
    };

    const removeCommunityCard = (index: number) => {
        const newCards = [...communityCards];
        newCards[index] = null;
        setCommunityCards(newCards);
        setResult(null);
    };

    const openCardPicker = (type: 'hole' | 'community', index: number) => {
        // Just checking basic constraints if needed
        setEditingSlot({ type, index });
    };

    const handleModalSelect = (card: CardType) => {
        if (!editingSlot) return;

        const { type, index } = editingSlot;

        if (type === 'hole') {
            const newCards = [...holeCards];
            newCards[index] = card;
            setHoleCards(newCards);
        } else {
            const newCards = [...communityCards];
            newCards[index] = card;
            setCommunityCards(newCards);
        }

        setResult(null);
    };

    const resetAll = () => {
        setHoleCards([null, null]);
        setCommunityCards([null, null, null, null, null]);
        setResult(null);
        setCalculating(false);
    };

    const runCalculation = async () => {
        const validHole = holeCards.filter((c): c is CardType => c !== null);
        const validComm = communityCards.filter((c): c is CardType => c !== null);

        if (validHole.length !== 2) return;

        setCalculating(true);

        // Use setTimeout to allow UI to update before heavy calculation
        setTimeout(async () => {
            try {
                const res = await calculateOdds(validHole, validComm, numOpponents);
                setResult(res);
            } catch (error) {
                console.error(error);
            } finally {
                setCalculating(false);
            }
        }, 100);
    };

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#0a0a0a] p-4 md:p-8 selection:bg-casino-green selection:text-white">
            <div className="w-full max-w-6xl space-y-8">
                {/* Header */}
                <header className="border-b border-white/10 pb-6 space-y-4">
                    <h1 className="text-3xl font-bold text-white text-center">
                        포커 확률 계산기
                    </h1>

                    <div className="flex items-end justify-center gap-3">
                        <button
                            onClick={resetAll}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-medium border border-white/10"
                        >
                            <RefreshCw size={14} /> 초기화
                        </button>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-slate-300 text-center">상대 플레이어</label>
                            <select
                                value={numOpponents}
                                onChange={(e) => setNumOpponents(parseInt(e.target.value))}
                                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium text-white outline-none focus:border-green-500 transition-colors cursor-pointer"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                    <option key={num} value={num}>{num}명</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left Column: Odds Display */}
                    <div className="xl:col-span-3 order-2 xl:order-1 space-y-6">
                        {result ? (
                            <OddsDisplay result={result} />
                        ) : (
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10 min-h-[200px] flex items-center justify-center text-center text-slate-400">
                                <p>내 카드 2장을 선택하고 계산을 눌러 승률을 확인하세요.</p>
                            </div>
                        )}
                    </div>

                    {/* Center Column: Table & Controls */}
                    <div className="xl:col-span-6 order-1 xl:order-2 space-y-8">
                        {/* Poker Table Visualization */}
                        <div className="relative min-h-[320px] md:min-h-[400px] rounded-3xl bg-[#065f46] shadow-2xl border-8 border-[#3d2b1f] flex items-center justify-center p-4 md:p-8">
                            {/* Felt Texture/Pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none rounded-[1.2rem]"></div>

                            <PokerTable
                                holeCards={holeCards}
                                communityCards={communityCards}
                                activeSelection={activeSelection} // Pass active state if needed to highlight slots
                                onRemoveHole={removeHoleCard}
                                onRemoveCommunity={removeCommunityCard}
                                onOpenPicker={openCardPicker}
                            />
                        </div>

                        {/* Card Picker Modal */}
                        <CardPickerModal
                            isOpen={!!editingSlot}
                            onClose={() => setEditingSlot(null)}
                            onSelect={handleModalSelect}
                            usedCards={allSelectedCards}
                        />

                        {/* Calculate Button - Moved here */}
                        <button
                            onClick={runCalculation}
                            disabled={holeCards.filter(c => c !== null).length < 2 || calculating}
                            className={`w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all transform active:scale-[0.99]
                        ${holeCards.filter(c => c !== null).length < 2
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white shadow-emerald-900/50 hover:shadow-emerald-900/70'
                                }
                    `}
                        >
                            {calculating ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" /> 계산 중...
                                </div>
                            ) : (
                                "확률 계산"
                            )}
                        </button>

                    </div>

                    {/* Right Column: Betting Advisor & Card Selector */}
                    <div className="xl:col-span-3 order-3 space-y-6">
                        <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-xl">
                            <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">베팅 어드바이저</h3>

                            <div className="space-y-4 mb-4">
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">현재 팟 ($)</label>
                                    <input
                                        type="number"
                                        value={potSize}
                                        onChange={(e) => setPotSize(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-slate-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-green-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">콜 금액 ($)</label>
                                    <input
                                        type="number"
                                        value={toCall}
                                        onChange={(e) => setToCall(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-slate-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-green-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Always visible component, internal logic handles empty state */}
                            <BettingAdvisor
                                winRate={result?.equity || 0}
                                potSize={Number(potSize) || 0}
                                toCall={Number(toCall) || 0}
                            />
                        </div>

                        <div className="bg-slate-900 p-4 rounded-xl border border-white/10 hidden md:block">
                            <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">카드 선택</h3>
                            <CardSelector
                                selectedCards={allSelectedCards}
                                onSelect={handleCardSelect}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
