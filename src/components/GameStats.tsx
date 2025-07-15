import React from 'react'
import { Target, Timer, Trophy } from 'lucide-react'

interface GameStatsProps {
  moves: number
  time: string
  score: number
  bestScore: number
}

const GameStats: React.FC<GameStatsProps> = ({
  moves,
  time,
  score,
  bestScore
}) => {
  return (
    <div className="game-stats">
      <div className="stat">
        <Target size={18} />
        <span>Moves: {moves}</span>
      </div>
      <div className="stat">
        <Timer size={18} />
        <span>Time: {time}</span>
      </div>
      <div className="stat">
        <Trophy size={18} />
        <span>Score: {score}</span>
      </div>
      {bestScore > 0 && (
        <div className="stat best">
          <Trophy size={18} />
          <span>Best: {bestScore}</span>
        </div>
      )}

      <style jsx>{`
        .game-stats {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .stat.best {
          color: #ffd700;
        }

        @media (max-width: 768px) {
          .game-stats {
            gap: 16px;
            flex-wrap: wrap;
            justify-content: center;
          }

          .stat {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .game-stats {
            gap: 12px;
          }

          .stat {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  )
}

export default GameStats
