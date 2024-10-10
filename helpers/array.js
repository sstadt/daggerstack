
import { titleCase } from '~/helpers/string';

/**
 * Exclude elements that occur in one array from another
 *
 * @param {Array} excludeArray The array of elements to exclude
 * @param {Array} arrayToFilter The array of elements to filter
 * @returns The resulting array
 */
export const excludeArrayItems = (excludeArray, arrayToFilter) => {
  const resultArray = arrayToFilter.slice();

  for (let item of excludeArray) {
    const index = resultArray.indexOf(item);

    if (index !== -1) {
      resultArray.splice(index, 1);
    }
  }

  return resultArray;
};

/**
 * Convert an array of values to an array of objects that
 * can be used as the options for any Select component
 *
 * @param {Array} arr The array to convert
 * @returns The resulting array
 */
export const createSelectOptions = (arr, capitalize = true) => {
  return structuredClone(arr).map((item) => ({
    label: capitalize ? titleCase(item) : item,
    value: item,
  }));
};

/**
 * Join an array with commas, but in a grammatically correct
 * way; properly use the word 'and' as part of the string
 *
 * @param {Array} arr The array to join
 * @returns The resulting string
 */
export const joinWithAnd = (arr) => {
  if (arr.length === 2) {
    return arr.join(' and ');
  }

  if (arr.length > 2) {
    const str = arr.join(', ');
    const lastCommaIndex = str.lastIndexOf(', ');

    return lastCommaIndex === -1
      ? str
      : `${str.substring(0, lastCommaIndex)}, and${str.substring(lastCommaIndex + 1)}`;
  }

  return arr[0];
};

export const uniqueElements = (arr) => {
  return arr.filter((value, index) => {
    return arr.indexOf(value) === index;
  });
};
