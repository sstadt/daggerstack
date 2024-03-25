
export const excludeArrayItems = (excludeArray, arrayToFilter) => {
  const resultArray = arrayToFilter.slice();

  for (let number of excludeArray) {
    const index = resultArray.indexOf(number);

    if (index !== -1) {
      resultArray.splice(index, 1);
    }
  }

  return resultArray;
};
