
import upgradeStrings from '~/config/upgradeStrings';

import GENERAL from '~/data/general';
import SUBCLASSES from '~/data/subclasses';
import WEAPONS from '~/data/weapons';
import ARMOR from '~/data/armor';
import COMMUNITY from '~/data/community';
import ANCESTRY from '~/data/ancestry';

let allSubclasses = [];
for (const [key] of Object.entries(SUBCLASSES)) {
  allSubclasses = allSubclasses.concat(SUBCLASSES[key]);
}

/**
 * Get a weapon's statistics from game data
 *
 * @param {String} name The name of the weapon
 * @returns The matchign weapon
 */
export const getWeapon = (name) =>
  WEAPONS.items.find((weapon) => weapon.name === name);

/**
 * Get armor statistics from game data
 *
 * @param {String} name The name of the armor
 * @returns The matching armor
 */
export const getArmor = (name) =>
  ARMOR.items.find((armor) => armor.name === name);

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
 * Calculate the total modifiers to a given attribute from an array
 * of upgrades. Each child of the modify parameter will count it's
 * modifier in the end result.
 *
 * Ex feature:
 *
 * { modify: { agility: 1, armorSlot: 2 } }
 *
 * Passing 'agility' as the attribute argument will increase the total
 * modifier by 1 given the above feature.
 *
 * @param {Array} features The array of enhancements
 * @param {String} attribute The name of the attribute to increase
 * @returns
 */
export const calculateModifiers = (features, attribute) => {
  let score = 0;

  if (features.length > 0) {
    score += features.reduce((bonus, feature) => {
      if (feature.modify && feature.modify[attribute] !== undefined) {
        bonus += feature.modify[attribute];
      }

      return bonus;
    }, 0);
  }

  return score;
};

/**
 * Get all character sheet features that modify a given attribute.
 * If companion is passed, skips all modifier types except level
 * selections (training).
 *
 * @param {Object} character The character to compile modifiers for
 * @param {attribute} attribute The attribute to compile modifiers for
 * @param {Object} options Additional options for filtering
 *  exclude: Array of modifier types to exclude
 * @returns An array of features
 */
export const getFeaturesByAttribute = (character, attribute, options = {}) => {
  // const weapons = character.inventory?.weapons
  //   .filter((characterWeapon) => characterWeapon.equipped)
  //   .map((characterWeapon) => {
  //     return { ...weaponsStore.weapon(characterWeapon.id) };
  //   });
  const subclasses = character.subclass
    ? character.subclass.map((characterSubclass) => {
        return allSubclasses.find((subclass) => subclass.name === characterSubclass);
      })
    : [];
  const community = character.community
    ? COMMUNITY.find((community) => character.community === community.name)
    : null;
  const ancestry = character.ancestry
    ? character.ancestry.map((ancestryName) => {
        return ANCESTRY.find((ancestry) => ancestry.name === ancestryName);
      })
    : null;
  const features = [];

  // weapons
  // if (weapons) {
  //   weapons.forEach((weapon) => {
  //     console.log(weapon);
  //     // features.push({ ...primaryWeapon.feature });
  //   });
  // }

  // items
  if (character.inventory?.items) {
    character.inventory.items
      .filter((i) => i.modify && i.modify[attribute])
      .forEach((item) => {
        features.push({
          name: item.name,
          modify: { ...item.modify },
        });
      });
  }

  // armor
  if (character.equipment?.armor?.name && attribute === 'armorScore') {
    const armor = ARMOR.items.find((a) => a.name === character.equipment.armor.name);
    const armorScore = options.exclude && options.exclude.includes('armorScore')
      ? 0
      : armor.score;

    features.push({
      name: armor.name,
      modify: {
        armorScore,
      },
    });

    if (armor.feature && armor.feature.modify && armor.feature.modify[attribute]) {
      features.push({ ...armor.feature });
    }
  }

  // subclasses
  if (subclasses.length > 0) {
    character.subclass.forEach((subclass, index) => {
      const subclassData = subclasses[index];
      const numUpgrades = character.levelSelections.filter((upgrade) => {
        return upgrade.type === 'subclass' && upgrade.value === subclass;
      }).length;

      // add foundation for every subclass
      if (subclassData.foundation[attribute]) {
        features.push({
          name: `${subclass} (foundation)`,
          modify: { ...subclassData.foundation },
        });
      }

      // add specialization for applicable
      if (numUpgrades > 0 && subclassData.specialization[attribute]) {
        features.push({
          name: `${subclass} (specialization)`,
          modify: { ...subclassData.specialization },
        });
      }

      // add mastery for applicable
      if (numUpgrades > 1 && subclassData.mastery[attribute]) {
        features.push({
          name: `${subclass} (mastery)`,
          modify: { ...subclassData.mastery },
        });
      }
    });
  }

  // community
  if (community) {
    community.features.forEach((feature) => {
      if (feature.modify && feature.modify[attribute]) {
        features.push(feature);
      }
    });
  }

  // ancestry
  if (ancestry) {
    const [ topAncestry, bottomAncestry ] = ancestry;
    const [ topFeature ] = topAncestry.features;
    const [ _, bottomFeature ] = ancestry.length > 1
      ? bottomAncestry.features
      : topAncestry.features;

    if (topFeature.modify && topFeature.modify[attribute]) {
      features.push({ ...topFeature });
    }

    if (bottomFeature.modify && bottomFeature.modify[attribute]) {
      features.push({ ...bottomFeature });
    }
  }

  // tier selections
  character.levelSelections.forEach((selection) => {
    if (
      selection.type === attribute ||
      Array.isArray(selection.options) && selection.options.includes(attribute)
    ) {
      const feature = {
        name: `Level ${selection.level} (selection)`,
        modify: {},
      };

      feature.modify[attribute] = selection.value;
      features.push(feature);
    }
  });

  // buffs
  if (character.buffs) {
    character.buffs.forEach((buff) => {
      if (buff.enabled && buff.modify.hasOwnProperty(attribute)) {
        const feature = { ...buff };

        feature.name = `${buff.name} (status effect)`;
        features.push(feature);
      }
    });
  }

  return features;
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
