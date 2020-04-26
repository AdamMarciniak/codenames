const winningPhrases = [
  'You must be so proud to have such a big brain.',
  'If only Einstein were as smart as you.',
  'Time to put this moment into a photo album. Go ahead. The losing team can wait.',
  'Literally nobody ever gets to this stage. You are a god.',
]

const losingPhrases = [
  'Is this what your parents raised you for? To lose?',
  'You poor despicable humans.',
  'Here is a tissue so you can cry into it.',
  'Codenames? More like code LAME. Back me up Sam.',
  'Your cluegiver should be given a stern talking-to.'
]

const phrases = {
  'win': winningPhrases,
  'lose': losingPhrases,
}

export const randomPhrase = (winState) => {
    return phrases[winState][Math.floor(Math.random() * phrases[winState].length)];
}

export default phrases;