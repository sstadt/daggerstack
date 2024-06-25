
import { joinWithAnd } from '~/helpers/array';

export const ucFirst = (str) => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const traitLabel = (num) => {
  return num > 0 ? `+${num}` : num;
};

export const titleCase = (str) => {
  return str.split(' ').map((s) => ucFirst(s)).join(' ');
};

export const modifierString = (modifiers) => {
  const bonuses = [];

  for (const [key, value] of Object.entries(modifiers)) {
    bonuses.push(`${value > 0 ? `+${value}` : value} to ${key}`);
  }

  return bonuses.length > 0 ? joinWithAnd(bonuses) : [];
};

export const featureDescription = (feature) => {
  const modifiers = feature && feature.modify
    ? modifierString(feature.modify)
    : null;

  if (feature.description && modifiers) return `${modifiers}. ${feature.description}`;
  if (!modifiers) return feature.description;
  if (!feature.description) return modifiers;

  return null;
};
