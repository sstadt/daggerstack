
import { joinWithAnd } from '~/helpers/array';

export const ucFirst = (str) => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const traitLabel = (num) => {
  return num > 0 ? `+${num}` : num;
};

export const titleCase = (str) => {
  return ucFirst(str).replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
};

export const modifierString = (modifiers) => {
  const bonuses = [];

  for (const [key, value] of Object.entries(modifiers)) {
    bonuses.push(`${value > 0 ? `+${value}` : value} to ${key}`);
  }

  return bonuses.length > 0 ? joinWithAnd(bonuses) : [];
};
