
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
