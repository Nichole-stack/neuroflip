import React from 'react'
import { Card } from '../types/game'
import GameCard from './GameCard'

interface GameBoardProps {
  cards: Card[]
  flippedCards: number[]
  matchedCards: number[]
  onCardClick: (cardId: number) => void
  gridCols: number
}

const GameBoard: React.FC<GameBoardProps> = ({
  cards,
  flippedCards,
  matchedCards,
  onCardClick,
  gridCols
}) => {
  return (
    <div className="game-board" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
      {cards.map((card) => (
        <GameCard
          key={card.id}
          card={card}
          isFlipped={flippedCards.includes(card.id)}
          isMatched={matchedCards.includes(card.id)}
          onClick={() => onCardClick(card.id)}
        />
      ))}

      <style jsx>{`
        .game-board {
          display: grid;
          gap: 16px;
          margin-bottom: 30px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .game-board {
            gap: 12px;
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .game-board {
            gap: 8px;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  )
}

export default GameBoard
