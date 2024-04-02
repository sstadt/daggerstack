
/**
 * Merge two objects, only applying updates to parameters
 * that already exist on target
 *
 * @param {Object} target The object to update
 * @param {Object} source The updates to apply to target
 * @returns Target, with any matching attributes updated
 */
export const deepMerge = (target, source) => {
  for (const key in source) {
    if (source[key] instanceof Object) {
      if (source[key] instanceof Array && target[key] instanceof Array) {
        target[key] = [...source[key]];
      } else if (target[key] instanceof Object) {
        deepMerge(target[key], source[key]);
      }
    } else if (target.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
  return target;
};
