
import upgradeStrings from '~/config/upgradeStrings';

import GENERAL from '~/data/general';
import SUBCLASSES from '~/data/subclasses';

/**
 * Determine the current tier of a character
 *
 * @param {Object} character The character to find tier for
 * @returns The tier the character currently is, Integer from 1 to 4
 */
export const getCharacterTier = (character) => {
  if (character.level > 7) return 4;
  if (character.level > 4) return 3;
  if (character.level > 1) return 2;
  return 1;
};

/**
 * Determine if a character should respect burden when calculating equipment
 * bonuses
 *
 * @param {Object} character The character to check
 * @returns True if character sould respect burden limitations, false if not
 */
export const respectBurden = (character) => {
  const multiclass = character.levelSelections
    .find((selection) => selection.type === 'multiclass');

  return !(
    character.baseClass === 'warrior' ||
    multiclass && multiclass.options.class === 'warrior'
  );
};

/**
 * Determine if a character can have a companion
 *
 * @param {Object} character The character to check
 * @returns Boolean True is the character can have a companion
 */
export const hasCompanion = (character) => {
  let hasCompanion = false;

  character.subclass.forEach((subclass) => {
    const multiclass = character.levelSelections.find((selection) => selection.type === 'multiclass');
    const classData = SUBCLASSES[character.baseClass].find((sc) => sc.name === subclass);
    const multiclassData = multiclass
      ? SUBCLASSES[multiclass.options.class].find((sc) => sc.name === subclass)
      : null;

    if (
      classData && classData.foundation.companion === true ||
      multiclassData && multiclassData.foundation.companion === true
    ) {
      hasCompanion = true;
      return; // break forEach
    }
  });

  return hasCompanion;
};

/**
 * Generate select options for an upgrade
 *
 * @param {Object} upgrade The upgrade object to generate options for
 * @return Array of options, or text string if only a single option
 */
export const getOptionsByUpgrade = (upgrade, character) => {
  const upgradeKeys = (upgrade.increase) ? Object.keys(upgrade.increase) : ['feature'];
  const [ firstUpgradeKey ] = upgradeKeys;

  if (!upgrade.increase) return firstUpgradeKey;

  if (upgrade.increase.trait) {
    return [
      { label: 'Agility', value: 'agility' },
      { label: 'Strength', value: 'strength' },
      { label: 'Finesse', value: 'finesse' },
      { label: 'Instinct', value: 'instinct' },
      { label: 'Presence', value: 'presence' },
      { label: 'Knowledge', value: 'knowledge' },
    ]
  }

  if (upgrade.increase.experience) {
    return character.experience.map((experience) => ({
      label: experience.name,
      value: experience.id,
    }));
  }

  if (upgradeKeys.length > 1) {
    return upgradeKeys.map((key) => {
      return {
        label: upgradeStrings[key],
        value: key,
      };
    });
  }

  return firstUpgradeKey;
};

/**
 * Get the broken down gold values from an existing character
 *
 * @param {Object} character The total gold (in handfuls) to split
 * @returns Object with handful, bag, and chest keys
 */
export const getGold = (character) => {
  const handfulsPerBag = GENERAL.gold.handfulsPerBag;
  const handfulsPerChest = GENERAL.gold.handfulsPerBag * GENERAL.gold.bagsPerChest;
  const currentGold = character.inventory.gold;

  const chest = Math.max(Math.floor(currentGold / handfulsPerChest), 0);
  const bag = Math.max(Math.floor((currentGold - (chest * handfulsPerChest)) / handfulsPerBag), 0);
  const handful = Math.max((currentGold - ((chest * handfulsPerChest) + (bag * handfulsPerBag))), 0);

  return {
    handful,
    bag,
    chest,
  };
};
