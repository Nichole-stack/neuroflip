import { Card } from '../types/game'

export const generateCards = (pairs: number): Card[] => {
  const symbols = ['🧠', '⚡', '🎯', '🔥', '💎', '🌟', '🚀', '💫', '🎨', '🎪', '🎭', '🎪']
  const cards: Card[] = []
  
  for (let i = 0; i < pairs; i++) {
    const symbol = symbols[i % symbols.length]
    cards.push(
      { id: i * 2, symbol },
      { id: i * 2 + 1, symbol }
    )
  }
  
  return cards
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
