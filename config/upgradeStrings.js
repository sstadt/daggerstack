
import { ucFirst } from '~/helpers/string';
import GENERAL from '~/data/general';

let traits = {};

GENERAL.traits.forEach((trait) => {
  traits[trait] = ucFirst(trait);
});

export default {
  ...traits,
  healthSlot: 'Hit Point',
  stressSlot: 'Stress',
  hopeSlot: 'Hope Slot',
  experience: 'Experience',
  armorSlot: 'Armor Slot',
  armorScore: 'Armor Score',
  evasion: 'Evasion',
  majorDamageThreshold: 'Major Damage Threshold',
  severeDamageThreshold: 'Severe Damage Threshold',
  newExperience: 'New Experience',
  proficiency: 'Proficiency',
  companionRange: 'Attack Range',
  companionDamage: 'Attack Damage',
  companionEvasion: 'Companion Evasion',
  primaryMeleeDamage: 'Primary Weapon Melee Damage',
  shortRestAction: 'Short Rest Action',
  longRestAction: 'Long Rest Action',
  longRestActionOnShortRest: 'Long Rest Action on Short Rest',
  goldHandful: 'Handful of gold',
};
