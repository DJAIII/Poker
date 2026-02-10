import { CardType, SimulationResult, Rank, Suite } from './types';

const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS: Suite[] = ['H', 'D', 'C', 'S'];

function getCardIndex(card: CardType): number {
    const r = RANKS.indexOf(card.rank);
    const s = SUITS.indexOf(card.suit);
    if (r === -1 || s === -1) throw new Error(`Invalid card: ${card.rank}${card.suit}`);
    return s * 13 + r;
}

function solveHand(cards: number[]): number {
    const ranks = new Array(13).fill(0);
    const suits = new Array(4).fill(0);
    const flushRanks = [[], [], [], []] as number[][];

    for (const c of cards) {
        const r = c % 13;
        const s = Math.floor(c / 13);
        ranks[r]++;
        suits[s]++;
        flushRanks[s].push(r);
    }

    let flushSuit = -1;
    for (let s = 0; s < 4; s++) if (suits[s] >= 5) flushSuit = s;

    // Straight Flush
    if (flushSuit !== -1) {
        const sRanks = flushRanks[flushSuit].sort((a, b) => a - b);
        let seq = 1;
        let bestSF = -1;
        for (let i = 0; i < sRanks.length; i++) {
            if (i > 0 && sRanks[i] === sRanks[i - 1] + 1) seq++;
            else seq = 1;
            if (seq >= 5) bestSF = sRanks[i];
        }
        // Wheel check A,2,3,4,5 -> 12,0,1,2,3. If 0,1,2,3 and 12 exist.
        if (sRanks.includes(12) && sRanks.includes(0) && sRanks.includes(1) && sRanks.includes(2) && sRanks.includes(3)) {
            if (bestSF === -1) bestSF = 3; // 5-high SF
            // Note: 5-high SF is lower than any other SF (lowest normal is 6-high: 2,3,4,5,6).
            // 6-high SF ending at 4 (rank 4 is 6).
            // 5-high SF ends at 3. Correct.
        }

        if (bestSF !== -1) return 8000000 + bestSF;
    }

    // Four of a Kind
    for (let r = 12; r >= 0; r--) {
        if (ranks[r] === 4) {
            for (let k = 12; k >= 0; k--) if (ranks[k] && k !== r) return 7000000 + r * 100 + k;
        }
    }

    // Full House
    let trips = -1;
    let pair = -1;
    for (let r = 12; r >= 0; r--) {
        if (ranks[r] >= 3) {
            if (trips === -1) trips = r;
            else if (pair === -1) pair = r;
        } else if (ranks[r] >= 2) {
            if (pair === -1) pair = r;
        }
    }
    if (trips !== -1 && pair !== -1) return 6000000 + trips * 100 + pair;

    // Flush
    if (flushSuit !== -1) {
        const f = flushRanks[flushSuit].sort((a, b) => b - a);
        return 5000000 + f[0] * 10000 + f[1] * 1000 + f[2] * 100 + f[3] * 10 + f[4];
    }

    // Straight
    const allRanks = [];
    for (let r = 0; r < 13; r++) if (ranks[r]) allRanks.push(r);

    let seq = 1;
    let bestStr = -1;
    for (let i = 0; i < allRanks.length; i++) {
        if (i > 0 && allRanks[i] === allRanks[i - 1] + 1) seq++;
        else seq = 1;
        if (seq >= 5) bestStr = allRanks[i];
    }
    if (allRanks.includes(12) && allRanks.includes(0) && allRanks.includes(1) && allRanks.includes(2) && allRanks.includes(3)) {
        if (bestStr === -1) bestStr = 3;
    }
    if (bestStr !== -1) return 4000000 + bestStr;

    // Three of a Kind
    if (trips !== -1) {
        let k1 = -1, k2 = -1;
        for (let r = 12; r >= 0; r--) {
            if (ranks[r] && r !== trips) {
                if (k1 === -1) k1 = r;
                else if (k2 === -1) { k2 = r; break; }
            }
        }
        return 3000000 + trips * 10000 + k1 * 100 + k2;
    }

    // Two Pair
    let p1 = -1, p2 = -1;
    for (let r = 12; r >= 0; r--) {
        if (ranks[r] >= 2) {
            if (p1 === -1) p1 = r;
            else if (p2 === -1) { p2 = r; break; }
        }
    }
    if (p1 !== -1 && p2 !== -1) {
        let k = -1;
        for (let r = 12; r >= 0; r--) if (ranks[r] && r !== p1 && r !== p2) { k = r; break; }
        return 2000000 + p1 * 10000 + p2 * 100 + k;
    }

    // One Pair
    if (p1 !== -1) { // p1 is the highest pair found above
        // Need to find 3 kickers
        let k1 = -1, k2 = -1, k3 = -1;
        for (let r = 12; r >= 0; r--) {
            if (ranks[r] && r !== p1) {
                if (k1 === -1) k1 = r;
                else if (k2 === -1) k2 = r;
                else if (k3 === -1) { k3 = r; break; }
            }
        }
        return 1000000 + p1 * 100000 + k1 * 1000 + k2 * 100 + k3;
    }

    // High Card
    const high = [];
    for (let r = 12; r >= 0; r--) if (ranks[r]) high.push(r);
    while (high.length < 5) high.push(0); // Should not happen for 5+ cards
    return high[0] * 100000 + high[1] * 10000 + high[2] * 1000 + high[3] * 100 + high[4];
}

export async function calculateOdds(
    holeCards: CardType[],
    communityCards: CardType[],
    numOpponents: number
): Promise<SimulationResult> {

    const myHand = holeCards.map(getCardIndex);
    const board = communityCards.map(getCardIndex);

    // Deck: all cards minus known
    const fullDeck = Array.from({ length: 52 }, (_, i) => i);
    const knownCards = new Set([...myHand, ...board]);
    const deck = fullDeck.filter(c => !knownCards.has(c));

    let wins = 0;
    let ties = 0;
    const iterations = 20000;
    const handBreakdown: { [key: string]: number } = {};

    // Reusable arrays
    const currentDeck = new Array(deck.length);

    for (let i = 0; i < iterations; i++) {
        // Shuffle deck (partial)
        for (let j = 0; j < deck.length; j++) currentDeck[j] = deck[j];

        let deckIdx = currentDeck.length;
        const cardsNeeded = (2 * numOpponents) + (5 - board.length);

        // Fisher-Yates-ish for needed cards
        for (let j = 0; j < cardsNeeded; j++) {
            const rand = Math.floor(Math.random() * deckIdx);
            deckIdx--;
            const temp = currentDeck[deckIdx];
            currentDeck[deckIdx] = currentDeck[rand];
            currentDeck[rand] = temp;
        }

        // Deal
        let dealPtr = currentDeck.length - 1;

        // Opponents
        const oppScores = [];
        for (let o = 0; o < numOpponents; o++) {
            const h1 = currentDeck[dealPtr--];
            const h2 = currentDeck[dealPtr--];
            // Board
            let runBoard = [...board];
            // Complete board from currentDeck (using remaining dealt cards?)
            // Wait, dealing order logic: Opponents get 2 cards, then Board gets remainder.
            // We shuffled enough cards.
            // We need to use the SAME board for everyone.
            // So we should pick board cards first or last.
            // Let's pick board cards first from the shuffled set?
            // Order doesn't matter for MC.
            // But we must ensure board is same for me and opponents.
            // So logic:
            // 1. Pick `cardsNeeded` cards.
            // 2. Assign first X to opponents, next Y to board.
            // Correct.

            // Wait, my loop structure was: `for (let o...)`.
            // Inside loop I initialized `runBoard`.
            // The board cards must be consistent for this iteration.
            // So I should deal board cards *once* per iteration.
        }

        // Correct approach:
        let ptr = currentDeck.length - 1;

        // Deal Opponents
        const oppHands = [];
        for (let o = 0; o < numOpponents; o++) {
            oppHands.push([currentDeck[ptr--], currentDeck[ptr--]]);
        }

        // Deal remaining Board
        const runBoard = [...board];
        while (runBoard.length < 5) {
            runBoard.push(currentDeck[ptr--]);
        }

        // Eval
        const myScore = solveHand([...myHand, ...runBoard]);
        let opponentBestScore = -1;
        for (const opp of oppHands) {
            const s = solveHand([...opp, ...runBoard]);
            if (s > opponentBestScore) opponentBestScore = s;
        }

        if (myScore > opponentBestScore) wins++;
        else if (myScore === opponentBestScore) ties++;

        // Breakdown
        if (i < iterations) { // Track all
            let type = "하이 카드";
            if (myScore >= 8000000) type = "스트레이트 플러시";
            else if (myScore >= 7000000) type = "포카드";
            else if (myScore >= 6000000) type = "풀하우스";
            else if (myScore >= 5000000) type = "플러시";
            else if (myScore >= 4000000) type = "스트레이트";
            else if (myScore >= 3000000) type = "트리플";
            else if (myScore >= 2000000) type = "투 페어";
            else if (myScore >= 1000000) type = "원 페어";

            handBreakdown[type] = (handBreakdown[type] || 0) + 1;
        }
    }

    // Results
    const breakdownResult: { [key: string]: number } = {};
    for (const k in handBreakdown) {
        breakdownResult[k] = parseFloat(((handBreakdown[k] / iterations) * 100).toFixed(1));
    }

    return {
        win: parseFloat(((wins / iterations) * 100).toFixed(1)),
        tie: parseFloat(((ties / iterations) * 100).toFixed(1)),
        lose: parseFloat((((iterations - wins - ties) / iterations) * 100).toFixed(1)),
        equity: parseFloat((((wins + ties / 2) / iterations) * 100).toFixed(1)),
        handBreakdown: breakdownResult
    };
}
