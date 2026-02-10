import React, { useState, useMemo, useEffect } from 'react';
import { CardType, Rank, Suite } from '@/lib/types';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (card: CardType) => void;
    usedCards: CardType[];
}

const RANKS: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS: { value: Suite; label: string; color: string }[] = [
    { value: 'S', label: '♠ 스페이드', color: 'text-slate-900' },
    { value: 'H', label: '♥ 하트', color: 'text-red-500' },
    { value: 'D', label: '♦ 다이아', color: 'text-red-500' },
    { value: 'C', label: '♣ 클로버', color: 'text-slate-900' },
];

export default function CardPickerModal({ isOpen, onClose, onSelect, usedCards }: CardPickerModalProps) {
    const [selectedSuit, setSelectedSuit] = useState<Suite>('S');
    const [selectedRank, setSelectedRank] = useState<Rank>('A');

    const isCardTaken = (rank: Rank, suit: Suite) => {
        return usedCards.some(c => c.rank === rank && c.suit === suit);
    };

    const handleConfirm = () => {
        if (isCardTaken(selectedRank, selectedSuit)) return;
        onSelect({
            rank: selectedRank,
            suit: selectedSuit,
            toString: () => `${selectedRank}${selectedSuit}`
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-900 px-4 py-3 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">카드 선택</h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Suit Select */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500 block">문양 (Suit)</label>
                        <div className="grid grid-cols-4 gap-2">
                            {SUITS.map((suit) => (
                                <button
                                    key={suit.value}
                                    onClick={() => setSelectedSuit(suit.value)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all",
                                        selectedSuit === suit.value
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                            : "border-slate-100 hover:border-slate-300 bg-white",
                                        suit.color
                                    )}
                                >
                                    <span className="text-2xl leading-none mb-1">{suit.label.split(' ')[0]}</span>
                                    <span className="text-[10px] font-bold uppercase">{suit.value}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rank Select */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500 block">숫자 (Rank)</label>
                        <div className="grid grid-cols-7 gap-1.5">
                            {RANKS.map(rank => {
                                const isTaken = isCardTaken(rank, selectedSuit);
                                return (
                                    <button
                                        key={rank}
                                        onClick={() => !isTaken && setSelectedRank(rank)}
                                        disabled={isTaken}
                                        className={cn(
                                            "p-2 rounded-lg border-2 font-bold text-base transition-all",
                                            selectedRank === rank && !isTaken
                                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 text-blue-700"
                                                : isTaken
                                                    ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                                                    : "border-slate-200 hover:border-slate-400 bg-white text-slate-700"
                                        )}
                                    >
                                        {rank}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Preview & Action */}
                    <div className="pt-2">
                        <button
                            onClick={handleConfirm}
                            disabled={isCardTaken(selectedRank, selectedSuit)}
                            className={cn(
                                "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-white shadow-lg",
                                isCardTaken(selectedRank, selectedSuit)
                                    ? "bg-slate-300 cursor-not-allowed text-slate-500"
                                    : "bg-blue-600 hover:bg-blue-500 active:scale-95"
                            )}
                        >
                            {isCardTaken(selectedRank, selectedSuit) ? (
                                <span>이미 선택된 카드입니다</span>
                            ) : (
                                <>
                                    <Check size={18} />
                                    카드 선택 완료
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
