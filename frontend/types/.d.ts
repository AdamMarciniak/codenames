
interface Avatar {
  id: number,
  player_id: number,
}

interface Word  {
  id: number,
  text: string,
  flipped: boolean,
  type: string,
}

interface Player {
  id: number, isCluegiver: boolean, name: string, team: 'RED' | 'BLUE' | 'NULL'
}

interface Players  {
  [id: number] : Player
}

export default interface Gamestate  {
  avatars : Avatar[],
  currentPlayerId: number,
  currentTurn: 'RED' | 'BLUE',
  roomCode: string,
  words: Word[]
}