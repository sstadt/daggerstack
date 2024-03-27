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
