import React from 'react'
import { Card } from '../types/game'

interface GameCardProps {
  card: Card
  isFlipped: boolean
  isMatched: boolean
  onClick: () => void
}

const GameCard: React.FC<GameCardProps> = ({
  card,
  isFlipped,
  isMatched,
  onClick
}) => {
  return (
    <div
      className={`game-card ${isFlipped || isMatched ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-pattern"></div>
        </div>
        <div className="card-back">
          <span className="card-symbol">{card.symbol}</span>
        </div>
      </div>

      <style jsx>{`
        .game-card {
          aspect-ratio: 1;
          perspective: 1000px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .game-card:hover {
          transform: scale(1.05);
        }

        .game-card.matched {
          cursor: default;
        }

        .game-card.matched:hover {
          transform: none;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          border-radius: 12px;
        }

        .game-card.flipped .card-inner {
          transform: rotateY(180deg);
        }

        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .card-front {
          background: linear-gradient(135deg, #667eea, #764ba2);
          overflow: hidden;
        }

        .card-back {
          background: linear-gradient(135deg, #f093fb, #f5576c);
          transform: rotateY(180deg);
        }

        .card-pattern {
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 2px, transparent 2px);
          background-size: 20px 20px;
        }

        .card-symbol {
          font-size: 2rem;
          font-weight: bold;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .game-card.matched .card-back {
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          animation: matchPulse 0.6s ease-in-out;
        }

        @keyframes matchPulse {
          0%, 100% { transform: rotateY(180deg) scale(1); }
          50% { transform: rotateY(180deg) scale(1.1); }
        }

        @media (max-width: 768px) {
          .card-symbol {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .card-symbol {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  )
}

export default GameCard
