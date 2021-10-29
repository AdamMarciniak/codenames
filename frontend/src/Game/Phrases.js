const winningPhrases = [
//   'You must be so proud to have such a big brain.',
//   'If only Einstein were as smart as you.',
//   'Time to put this moment into a photo album. Go ahead. The losing team can wait.',
//   'Literally nobody ever gets to this stage. I applaud your skill.',
  `As a winner you are entitled to twenty burpees from a loser of your choosing`
]

const losingPhrases = [
//   'How does it feel to get your ass kicked?',
//   `It's ok to lose. Frankly, it's kinda lonely at the top.`,
//   `Here's a tissue you can cry into. Go ahead, the winners can wait.`,
//   'Your cluegiver should be given a stern talking-to.',
  `As a loser you owe the winners twenty burpees. Go ahead.... the winners can wait.`
]

const phrases = {
  'win': winningPhrases,
  'lose': losingPhrases,
}

export const randomPhrase = (gameState, winState) => {
  const sumOfWordIds = gameState.words.reduce((sum, {id}) => id + sum, 0);
  return phrases[winState][sumOfWordIds % phrases[winState].length];
}
