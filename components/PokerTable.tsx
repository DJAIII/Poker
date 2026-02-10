import React from 'react';
import { CardType } from '@/lib/types';
import PlayingCard from './PlayingCard';
import { X } from 'lucide-react';

interface PokerTableProps {
    holeCards: CardType[];
    communityCards: CardType[];
    activeSelection?: string | null;
    onRemoveHole: (index: number) => void;
    onRemoveCommunity: (index: number) => void;
    onOpenPicker?: (type: 'hole' | 'community', index: number) => void;
}

const PokerTable: React.FC<PokerTableProps> = ({
    holeCards,
    communityCards,
    activeSelection,
    onRemoveHole,
    onRemoveCommunity,
    onOpenPicker
}) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-between py-2 relative z-10">

            {/* Community Cards Area */}
            {/* Community Cards Area */}
            <div className="flex flex-col items-center space-y-2 mt-4 md:mt-8 w-full max-w-md px-2">
                <div className="text-white/50 text-xs font-semibold tracking-wider uppercase">커뮤니티 카드</div>
                <div className="grid grid-cols-5 gap-1.5 w-full">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <div key={`community-${index}`} className="relative group w-full aspect-[2.5/3.5]">
                            {communityCards[index] ? (
                                <>
                                    <PlayingCard
                                        card={communityCards[index]}
                                        className="shadow-xl w-full h-full text-xs sm:text-sm"
                                    />
                                    <button
                                        onClick={() => onRemoveCommunity(index)}
                                        className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-white/10 z-10"
                                    >
                                        <X size={10} className="sm:w-3 sm:h-3" />
                                    </button>
                                    {/* Label for Flop/Turn/River */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] text-white/40 font-mono whitespace-nowrap">
                                        {index < 3 ? '플랍' : index === 3 ? '턴' : '리버'}
                                    </div>
                                </>
                            ) : (
                                <PlayingCard
                                    isEmpty
                                    className="w-full h-full"
                                    onClick={() => onOpenPicker?.('community', index)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>


            {/* Player Area */}
            {/* Player Area */}
            <div className="flex flex-col items-center space-y-2 mb-4 w-full max-w-[200px] md:max-w-xs">
                <div className="bg-slate-900/80 px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    내 핸드 (Hero)
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-4 p-3 md:p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 w-full">
                    {[0, 1].map((index) => (
                        <div key={`hole-${index}`} className="relative group w-full aspect-[2.5/3.5]">
                            {holeCards[index] ? (
                                <>
                                    <PlayingCard
                                        card={holeCards[index]}
                                        className="shadow-2xl ring-2 ring-black/20 w-full h-full text-sm sm:text-base"
                                    />
                                    <button
                                        onClick={() => onRemoveHole(index)}
                                        className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-white/10 z-10"
                                    >
                                        <X size={12} />
                                    </button>
                                </>
                            ) : (
                                <PlayingCard
                                    isEmpty
                                    className="w-full h-full"
                                    onClick={() => onOpenPicker?.('hole', index)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default PokerTable;
