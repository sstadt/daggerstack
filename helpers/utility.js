
import { badWords, replacementChars, keyBlacklist } from '~/config/profanity';

/**
 * Generate a unique uuid
 *
 * @returns The new uuid
 */
export const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
};

/**
 * Limit the frequenscy with which a function can fire
 *
 * @param {function} func Function to debounce
 * @param {integer} wait Debounce duration in milliseconds
 * @param {boolean} immediate Call function immediately
 */
export const debounce = (func, wait = 300, immediate = false) => {
  let timeout;

  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

/**
 * Clone an array or object
 *
 * @param {Object} obj The structure to clone
 * @returns The cloned object, detached from previous pointer
 */
export const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Wait until a condition is true
 *
 * @param {Function} condition A function that returns true when the condition is met
 * @param {Integer} delay Time between checking condition
 * @param {Integer} iterations Maximum number of iterations to complete
 * @returns {Promise} Resolves when the condition is true, rejects if iteration count is reach and the condition is still not true
 */
export const waitUntil = (condition, delay = 100, iterations = 100) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval);
        resolve();
      }

      if (count >= iterations) reject();
      count += 1;
    }, delay);
  });
};

// Helper function to generate a random string of symbols
const getRandomSymbols = (length) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * replacementChars.length);
    result += replacementChars[randomIndex];
  }
  return result;
};

const cleanString = (input) => {
  // Replace each profane word in the input string
  badWords.forEach(badWord => {
    const regex = new RegExp(badWord, 'gi');
    input = input.replace(regex, match => getRandomSymbols(match.length));
  });

  return input;
};

export const cleanProfanity = (obj) => {
  const target = clone(obj);

  if (Array.isArray(target)) {
    // If the target is an array, iterate through each element
    return target.map((item) => {
      if (typeof item === 'object' && item !== null) {
        // Recursively clean nested objects or arrays
        return cleanProfanity(item);
      } else if (typeof item === 'string') {
        // Clean string values in arrays
        return cleanString(item);
      }
      // Return non-object and non-string elements unchanged
      return item;
    });
  } else if (typeof target === 'object' && target !== null) {
    // If the target is an object, iterate through its keys
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        if (Array.isArray(target[key])) {
          // Recursively clean arrays within objects
          target[key] = cleanProfanity(target[key]);
        } else if (typeof target[key] === 'object' && target[key] !== null) {
          // Recursively clean nested objects
          target[key] = { ...cleanProfanity(target[key]) };
        } else if (typeof target[key] === 'string' && !keyBlacklist.includes(key)) {
          // Apply cleanProfanity to string values
          target[key] = cleanString(target[key]);
        }
      }
    }
  }

  return target;
};
