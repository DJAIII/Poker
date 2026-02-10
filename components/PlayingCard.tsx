import React from 'react';
import { CardType, Rank, Suite } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface PlayingCardProps {
    card?: CardType; // If null/undefined, shows card back or empty slot
    rank?: Rank;
    suit?: Suite;
    selected?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    isBack?: boolean;
    isEmpty?: boolean;
}

const SUIT_ICONS = {
    'H': <Heart className="w-full h-full fill-current" />,
    'D': <Diamond className="w-full h-full fill-current" />,
    'C': <Club className="w-full h-full fill-current" />,
    'S': <Spade className="w-full h-full fill-current" />,
};

const SUIT_COLORS = {
    'H': 'text-red-500',
    'D': 'text-red-500',
    'C': 'text-slate-900',
    'S': 'text-slate-900',
};

const PlayingCard: React.FC<PlayingCardProps> = ({
    card,
    rank,
    suit,
    selected,
    disabled,
    onClick,
    className,
    isBack = false,
    isEmpty = false
}) => {
    const finalRank = card?.rank || rank;
    const finalSuit = card?.suit || suit;

    if (isEmpty) {
        return (
            <div
                onClick={onClick}
                className={cn(
                    "w-14 h-20 rounded-md border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors",
                    className
                )}
            >
                <span className="text-[10px] text-white/30 font-medium">빈 슬롯</span>
            </div>
        );
    }

    if (isBack) {
        return (
            <div className={cn(
                "w-14 h-20 rounded-md bg-white border border-slate-200 shadow-sm relative overflow-hidden",
                className
            )}>
                <div className="absolute inset-1 bg-red-600 rounded-sm"
                    style={{ backgroundImage: "repeating-linear-gradient(45deg, #cc0000 0, #cc0000 10px, #b30000 10px, #b30000 20px)" }}></div>
            </div>
        );
    }

    if (!finalRank || !finalSuit) return null;

    return (
        <div
            onClick={!disabled ? onClick : undefined}
            className={cn(
                "relative w-14 h-20 bg-white rounded-md shadow-sm border border-slate-200 flex flex-col items-center justify-between p-1 select-none transition-all duration-200",
                SUIT_COLORS[finalSuit],
                selected && "ring-4 ring-green-500 ring-offset-2 ring-offset-slate-900 z-10 scale-110",
                disabled && "opacity-40 grayscale cursor-not-allowed",
                !disabled && "cursor-pointer hover:-translate-y-1 hover:shadow-md",
                className
            )}
        >
            <div className="text-sm font-bold leading-none self-start ml-0.5">{finalRank}</div>
            <div className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
                {SUIT_ICONS[finalSuit]}
            </div>
            <div className="w-3 h-3 self-end mr-0.5 mb-0.5">
                {SUIT_ICONS[finalSuit]}
            </div>
        </div>
    );
};

export default PlayingCard;
