import React from 'react';
import { CardType, Rank, Suite } from '@/lib/types';
import PlayingCard from './PlayingCard';

interface CardSelectorProps {
    selectedCards: CardType[];
    onSelect: (card: CardType) => void;
}

const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS: Suite[] = ['S', 'H', 'D', 'C']; // Spades, Hearts, Diamonds, Clubs order usually

const CardSelector: React.FC<CardSelectorProps> = ({ selectedCards, onSelect }) => {

    const isSelected = (rank: Rank, suit: Suite) => {
        return selectedCards.some(c => c.rank === rank && c.suit === suit);
    };

    return (
        <div className="hidden md:flex flex-col gap-4">
            {SUITS.map(suit => (
                <div key={suit} className="flex flex-wrap gap-2 justify-start">
                    {RANKS.map(rank => {
                        const selected = isSelected(rank, suit);
                        // Construct card object on fly
                        const cardObj: CardType = { rank, suit, toString: () => `${rank}${suit}` };

                        return (
                            <PlayingCard
                                key={`${rank}${suit}`}
                                rank={rank}
                                suit={suit}
                                selected={selected}
                                disabled={selected}
                                onClick={() => onSelect(cardObj)}
                                className="w-10 h-14 text-xs sm:w-12 sm:h-16"
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default CardSelector;
