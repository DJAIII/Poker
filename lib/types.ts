export type Suite = 'H' | 'D' | 'C' | 'S'; // Hearts, Diamonds, Clubs, Spades
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export interface CardType {
    rank: Rank;
    suit: Suite;
    toString: () => string;
}

export interface SimulationResult {
    win: number;
    tie: number;
    lose: number;
    equity: number;
    details?: string;
    handBreakdown: {
        [key: string]: number; // e.g., "Flush": 15.5
    };
}
