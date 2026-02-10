# Poker Odds Calculator - Next.js App Router

## Prerequisites
- Node.js 18+ installed

## Setup & Run

1. **Install Dependencies**
   ```bash
   npm install
   ```
   *Note: If you see peer dependency warnings, you can duplicate them or use `--legacy-peer-deps` depending on your npm version, but standard `npm install` should work with the provided `package.json`.*

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Application**
   - Open your browser to `http://localhost:3000`

## Features
- **Visual Card Selector**: Select cards from a grid.
- **Poker Table**: Visual representation of Hole cards and Community cards.
- **Monte Carlo Simulation**: custom 20,000 iteration simulation in `lib/poker-engine.ts`.
- **Real-time Odds**: Win/Tie/Lose percentages.
- **Hand Breakdown**: Probability of hitting specific hands (Flush, Straight, etc.).

## Project Structure
- `app/page.tsx`: Main game controller and layout.
- `lib/poker-engine.ts`: Core logic for hand evaluation and Monte Carlo simulation.
- `components/`: UI components (CardSelector, PlayingCard, PokerTable, OddsDisplay).
