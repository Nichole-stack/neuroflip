export interface Card {
  id: number
  symbol: string
}

export type GameState = 'menu' | 'playing' | 'completed'

export type Difficulty = 'easy' | 'medium' | 'hard'
