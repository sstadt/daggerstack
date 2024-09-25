
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