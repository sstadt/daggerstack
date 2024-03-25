
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
