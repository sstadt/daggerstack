
import { uuidv4 } from '~/helpers/utility';
import upgradeStrings from '~/config/upgradeStrings';

import GENERAL from '~/data/general';
import CLASSES from '~/data/classes';
import SUBCLASSES from '~/data/subclasses';
import WEAPONS from '~/data/weapons';
import ARMOR from '~/data/armor';
import ITEMS from '~/data/items';
import COMMUNITY from '~/data/community';
import ANCESTRY from '~/data/ancestry';

const equipmentFeatures = [ ...WEAPONS.features ].concat([ ...ARMOR.features ]);

let allSubclasses = [];
for (const [key] of Object.entries(SUBCLASSES)) {
  allSubclasses = allSubclasses.concat(SUBCLASSES[key]);
}

export const newCharacter = () => {
  return {
    id: uuidv4(),
    version: GENERAL.currentCharacterVersion,
    name: '',
    pronouns: '',
    description: '',
    baseClass: '',
    subclass: [],
    community: '',
    ancestry: '',
    level: 1,
    agility: {
      score: '',
      upgraded: false,
    },
    strength: {
      score: '',
      upgraded: false,
    },
    finesse: {
      score: '',
      upgraded: false,
    },
    instinct: {
      score: '',
      upgraded: false,
    },
    presence: {
      score: '',
      upgraded: false,
    },
    knowledge: {
      score: '',
      upgraded: false,
    },
    evasion: null,
    armor: {
      current: 0,
      slots: 6,
    },
    threshold: {
      minor: null,
      major: null,
      severe: null,
    },
    health: {
      current: 0,
      slots: 6,
    },
    stress: {
      current: 0,
      slots: 6,
    },
    hope: 2,
    equipment: {
      primaryWeapon: newWeapon(),
      secondaryWeapon: newWeapon(),
      armor: newArmor(),
    },
    inventory: {
      items: [],
      gold: {
        handful: 1,
        bag: 0,
        chest: 0,
      },
      weapons: [],
    },
    experience: [],
    background: [],
    connection: [],
    levelSelections: [],
    companion: {
      name: null,
      species: null,
      traits: [],
      evasion: 10,
      stress: {
        current: 0,
        slots: 3,
      },
      experience: [],
      levelSelections: []
    },
  };
};

export const newWeapon = (weapon = {}) => {
  const defaults = {
    id: uuidv4(),
    name: null,
    notes: '',
    attachment: null,
  };
  const options = Object.assign({}, defaults, weapon);

  return {
    id: options.id,
    name: options.name,
    notes: options.notes,
    attachment: options.attachment,
  };
};

export const getWeapon = (name) =>
  WEAPONS.items.find((weapon) => weapon.name === name);

export const newArmor = (armor = {}) => {
  const defaults = {
    id: uuidv4(),
    name: null,
    notes: '',
    attachment: null,
  };
  const options = Object.assign({}, defaults, armor);

  return {
    id: options.id,
    name: options.name,
    notes: options.notes,
    attachment: options.attachment,
  };
};

export const getArmor = (name) =>
  ARMOR.items.find((armor) => armor.name === name);

export const newItem = (item = {}) => {
  const defaults = {
    id: uuidv4(),
    name: null,
    chargesUsed: 0,
    notes: '',
    attachment: null,
    custom: false,
    quantity: 1,
    modify: {},
    options: {},
  };
  const options = Object.assign({}, defaults, item);

  return {
    id: options.id,
    name: options.name,
    chargesUsed: options.chargesUsed,
    notes: options.notes,
    attachment: options.attachment,
    custom: options.custom,
    quantity: options.quantity,
    modify: { ...options.modify },
    options: { ...options.options },
  };
};

export const getItem = (name) =>
  ITEMS.items.find((item) => item.name === name);

export const newUpgrade = ({ id, level, type, value, options }) => {
  return {
    id, // must match the ID in the class leveling data
    level, // level upgrade was acquired
    type, // upgrade type string
    value, // primary option selected
    options, // additional options; Array || Object
  };
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
  const burden = respectBurden(character) && character.equipment
    ? character.equipment.primaryWeapon.burden + character.equipment.secondaryWeapon.burden
    : 0;
  const subclasses = character.subclass
    ? character.subclass.map((characterSubclass) => {
        return allSubclasses.find((subclass) => subclass.name === characterSubclass);
      })
    : [];
  const community = character.community
    ? COMMUNITY.find((community) => character.community === community.name)
    : null;
  const ancestry = character.ancestry
    ? ANCESTRY.find((ancestry) => character.ancestry === ancestry.name)
    : null;
  const features = [];

  // weapons
  if (character.equipment && character.equipment.primaryWeapon.name) {
    const primaryWeapon = WEAPONS.items
      .find((w) => w.name === character.equipment.primaryWeapon.name);

    if (primaryWeapon.feature && primaryWeapon.feature.modify && primaryWeapon.feature.modify[attribute]) {
      features.push({ ...primaryWeapon.feature });
    }
  }

  // items
  if (character.inventory && character.inventory.items) {
    character.inventory.items
      .filter((i) => i.modify && i.modify[attribute])
      .forEach((item) => {
        console.log(item);
        features.push({
          name: item.name,
          modify: { ...item.modify },
        });
      });
  }

  // verify we are not carrying too much before including secondary weapon feature
  if (character.equipment && burden < 3 && character.equipment.secondaryWeapon.name) {
    const secondaryWeapon = WEAPONS.items
      .find((w) => w.name === character.equipment.secondaryWeapon.name);

    if (secondaryWeapon.feature && secondaryWeapon.feature.modify && secondaryWeapon.feature.modify[attribute]) {
      features.push({ ...secondaryWeapon.feature });
    }
  }

  // armor
  if (character.equipment && character.equipment.armor.name) {
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
      features.push({
        name: `${subclass} (foundation)`,
        modify: { ...subclassData.foundation },
      });

      // add specialization for applicable
      if (numUpgrades > 0) {
        features.push({
          name: `${subclass} (specialization)`,
          modify: { ...subclassData.specialization },
        });
      }

      // add mastery for applicable
      if (numUpgrades > 1) {
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
    ancestry.features.forEach((feature) => {
      if (feature.modify && feature.modify[attribute]) {
        features.push(feature);
      }
    });
  }

  // tier selections
  character.levelSelections.forEach((selection) => {
    if (
      selection.type === attribute ||
      Array.isArray(selection.options) && selection.options.includes(attribute)
    ) {
      const feature = {
        name: `Level ${selection.level}`,
        modify: {},
      };

      feature.modify[attribute] = selection.value;
      features.push(feature);
    }
  });

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
