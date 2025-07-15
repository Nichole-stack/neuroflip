import React from 'react'
import { RotateCcw } from 'lucide-react'

interface GameControlsProps {
  onReset: () => void
}

const GameControls: React.FC<GameControlsProps> = ({ onReset }) => {
  return (
    <div className="game-controls">
      <button className="control-btn reset-btn" onClick={onReset}>
        <RotateCcw size={18} />
        <span>Reset Game</span>
      </button>

      <style jsx>{`
        .game-controls {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reset-btn {
          background: rgba(255, 255, 255, 0.9);
          color: #667eea;
          border: 2px solid #667eea;
        }

        .reset-btn:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        @media (max-width: 480px) {
          .control-btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
}

export default GameControls
