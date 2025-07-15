import React, { useState, useEffect, useCallback } from 'react'
import { Brain, RotateCcw, Trophy, Timer, Target } from 'lucide-react'
import GameBoard from './components/GameBoard'
import GameStats from './components/GameStats'
import GameControls from './components/GameControls'
import { Card, GameState, Difficulty } from './types/game'
import { generateCards, shuffleArray } from './utils/gameUtils'

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedCards, setMatchedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState<number>(
    parseInt(localStorage.getItem('neuroflip-best-score') || '0')
  )

  const difficultySettings = {
    easy: { pairs: 6, gridCols: 4 },
    medium: { pairs: 8, gridCols: 4 },
    hard: { pairs: 12, gridCols: 6 }
  }

  const startGame = useCallback(() => {
    const { pairs } = difficultySettings[difficulty]
    const newCards = generateCards(pairs)
    setCards(shuffleArray(newCards))
    setFlippedCards([])
    setMatchedCards([])
    setMoves(0)
    setTime(0)
    setScore(0)
    setGameState('playing')
  }, [difficulty])

  const resetGame = useCallback(() => {
    setGameState('menu')
    setCards([])
    setFlippedCards([])
    setMatchedCards([])
    setMoves(0)
    setTime(0)
    setScore(0)
  }, [])

  const handleCardClick = useCallback((cardId: number) => {
    if (gameState !== 'playing' || flippedCards.length >= 2 || 
        flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return
    }

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      
      const [firstCard, secondCard] = newFlippedCards.map(id => 
        cards.find(card => card.id === id)!
      )

      if (firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setMatchedCards(prev => [...prev, ...newFlippedCards])
          setFlippedCards([])
          setScore(prev => prev + 100)
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }, [gameState, flippedCards, matchedCards, cards])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState])

  // Check for game completion
  useEffect(() => {
    if (gameState === 'playing' && matchedCards.length === cards.length && cards.length > 0) {
      const finalScore = Math.max(0, 1000 - moves * 10 - time * 2)
      setScore(finalScore)
      
      if (finalScore > bestScore) {
        setBestScore(finalScore)
        localStorage.setItem('neuroflip-best-score', finalScore.toString())
      }
      
      setGameState('completed')
    }
  }, [matchedCards, cards.length, gameState, moves, time, bestScore])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (gameState === 'menu') {
    return (
      <div className="game-container">
        <div className="menu-screen">
          <div className="menu-header">
            <Brain className="menu-icon" size={64} />
            <h1 className="menu-title">NeuroFlip</h1>
            <p className="menu-subtitle">Challenge your memory and cognitive skills</p>
          </div>

          <div className="difficulty-selector">
            <h3>Select Difficulty</h3>
            <div className="difficulty-buttons">
              {Object.entries(difficultySettings).map(([key, settings]) => (
                <button
                  key={key}
                  className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
                  onClick={() => setDifficulty(key as Difficulty)}
                >
                  <span className="difficulty-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span className="difficulty-info">{settings.pairs} pairs</span>
                </button>
              ))}
            </div>
          </div>

          {bestScore > 0 && (
            <div className="best-score">
              <Trophy size={20} />
              <span>Best Score: {bestScore}</span>
            </div>
          )}

          <button className="start-btn" onClick={startGame}>
            Start Game
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-title">
          <Brain size={32} />
          <h1>NeuroFlip</h1>
        </div>
        
        <GameStats 
          moves={moves}
          time={formatTime(time)}
          score={score}
          bestScore={bestScore}
        />
      </div>

      <GameBoard
        cards={cards}
        flippedCards={flippedCards}
        matchedCards={matchedCards}
        onCardClick={handleCardClick}
        gridCols={difficultySettings[difficulty].gridCols}
      />

      <GameControls onReset={resetGame} />

      {gameState === 'completed' && (
        <div className="game-complete-overlay">
          <div className="game-complete-modal">
            <Trophy className="complete-icon" size={48} />
            <h2>Congratulations!</h2>
            <div className="final-stats">
              <div className="stat">
                <Target size={20} />
                <span>Moves: {moves}</span>
              </div>
              <div className="stat">
                <Timer size={20} />
                <span>Time: {formatTime(time)}</span>
              </div>
              <div className="stat">
                <Trophy size={20} />
                <span>Score: {score}</span>
              </div>
            </div>
            <div className="complete-actions">
              <button className="play-again-btn" onClick={startGame}>
                Play Again
              </button>
              <button className="menu-btn" onClick={resetGame}>
                Main Menu
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .game-container {
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          padding: 20px;
        }

        .menu-screen {
          text-align: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .menu-header {
          margin-bottom: 40px;
        }

        .menu-icon {
          color: #667eea;
          margin-bottom: 16px;
        }

        .menu-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .menu-subtitle {
          color: #666;
          font-size: 1.1rem;
        }

        .difficulty-selector {
          margin-bottom: 30px;
        }

        .difficulty-selector h3 {
          margin-bottom: 20px;
          color: #333;
          font-size: 1.2rem;
        }

        .difficulty-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .difficulty-btn {
          padding: 16px 24px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 120px;
        }

        .difficulty-btn:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
        }

        .difficulty-btn.active {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .difficulty-name {
          font-weight: 600;
          font-size: 1rem;
        }

        .difficulty-info {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .best-score {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 30px;
          color: #667eea;
          font-weight: 600;
        }

        .start-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 16px 48px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .game-title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #667eea;
        }

        .game-title h1 {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .game-complete-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .game-complete-modal {
          background: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .complete-icon {
          color: #ffd700;
          margin-bottom: 20px;
        }

        .game-complete-modal h2 {
          margin-bottom: 30px;
          color: #333;
          font-size: 2rem;
        }

        .final-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 30px;
        }

        .stat {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #666;
          font-weight: 500;
        }

        .complete-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .play-again-btn, .menu-btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .play-again-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
        }

        .menu-btn {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .play-again-btn:hover, .menu-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        @media (max-width: 768px) {
          .game-container {
            padding: 16px;
          }

          .menu-screen {
            padding: 30px 20px;
          }

          .menu-title {
            font-size: 2.5rem;
          }

          .game-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .difficulty-buttons {
            flex-direction: column;
            align-items: center;
          }

          .complete-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default App
