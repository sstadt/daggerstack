/**
 * Get a random number between high and low
 *
 * @param {Number} low Lowest possible resul
 * @param {Number} high Highest possible result
 * @returns {Integer} The randomly generated number between low and high
 */
export const getRandomNumber = (low, high) => {
  const min = Math.ceil(low);
  const max = Math.floor(high);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Roll some dice!
 *
 * @param {String} diceStr Dice to roll in 1d20+5 format
 */
export const rollDice = (diceStr) => {
  const str = diceStr.replace(' ', '');
  const [dice, modifier] = str.split(/[+-]/);
  const [num, sides] = dice.split(/[dD]/);
  const output = { results: [] };

  for (let i = 0; i < num; i++) {
    output.results.push(getRandomNumber(1, sides));
  }

  output.total = output.results.reduce((p, c) => p + c);

  if (modifier) {
    if (diceStr.includes('+')) {
      output.total += parseInt(modifier, 10);
    } else if (diceStr.includes('-')) {
      output.total -= parseInt(modifier, 10);
    }
  }

  return output;
};
