
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

export const createSelectOptions = (arr) => {
  return structuredClone(arr).map((item) => ({
    label: item,
    value: item,
  }));
};
