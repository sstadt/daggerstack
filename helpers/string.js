
export const ucFirst = (str) => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const traitLabel = (num) => {
  return num > 0 ? `+${num}` : num;
};
