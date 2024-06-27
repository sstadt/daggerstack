
import { uuidv4 } from '~/helpers/utility';
import upgradeStrings from '~/config/upgradeStrings';

import GENERAL from '~/data/general';
import CLASSES from '~/data/classes';
import SUBCLASSES from '~/data/subclasses';
import WEAPONS from '~/data/weapons';
import ARMOR from '~/data/armor';
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
      items: '',
      gold: {
        handful: 1,
        bag: 0,
        chest: 0,
      },
      weapon: newWeapon(),
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

export const newWeapon = () => {
  return {
    name: null,
    type: 'weapon',
    trait: null,
    primary: false,
    secondary: false,
    range: null,
    feature: null,
    secondaryFeature: null,
    damage: null,
    damageType: null,
    burden: 0,
    starting: false,
  };
};

export const newArmor = () => {
  return {
    name: null,
    type: 'armor',
    feature: null,
    score: 0,
    starting: false,
  };
};

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
 * Inventory items are stores as a single string, this function
 * breaks that master string down to be loaded into the character
 * builder when loading a saved character from localStorage.
 *
 * TODO: upgrade beginning inventory to use a list of items and get rid
 *       of this garbage
 *
 * @param {String} items The comma separated item string to split
 * @param {String} baseClass The character's main class
 * @returns {
 *  items: String,
 *  spellbook: String,
 *  generalItem: String,
 *  classItem: String,
 * }
 */
export const separateItemsForBuilder = (items, baseClass) => {
  const itemArr = items !== '' ? items.split(',').map((item) => item.trim()) : [];
  const spellbookIndex = itemArr.findIndex((item) => item.includes('spellbook'));
  const [existingSpellbook] = spellbookIndex > -1
    ? itemArr.splice(spellbookIndex, 1)
    : [''];
  const spellbook = existingSpellbook.replace('(spellbook)', '').trim();

  let generalItem = '';
  let classItem = '';

  GENERAL.startingGear.choose.forEach((choice) => {
    const itemIndex = itemArr.findIndex((item) => item === choice);

    if (itemIndex > -1) {
      generalItem = itemArr.splice(itemIndex, 1);
    }
  });

  if (baseClass) {
    CLASSES[baseClass].startingGear.choose
      .forEach((choice) => {
        const itemIndex = itemArr.findIndex((item) => item === choice);

        if (itemIndex > -1) {
          classItem = itemArr.splice(itemIndex, 1);
        }
      });
  }

  return {
    items: itemArr.length > 0
      ? itemArr.join(', ')
      : GENERAL.startingGear.take.join(', '),
    spellbook,
    generalItem,
    classItem,
  };
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
  if (character.equipment && character.equipment.primaryWeapon.feature) {
    const primaryFeature = equipmentFeatures.find(
      (feature) => feature.name === character.equipment.primaryWeapon.feature,
    );

    if (primaryFeature && primaryFeature.modify && primaryFeature.modify[attribute]) {
      features.push(primaryFeature);
    }
  }

  // verify we are not carrying too much before including secondary weapon feature
  if (character.equipment && burden < 3 && character.equipment.secondaryWeapon.secondaryFeature) {
    const secondaryFeature = equipmentFeatures.find(
      (feature) => feature.name === character.equipment.secondaryWeapon.secondaryFeature,
    );

    if (secondaryFeature && secondaryFeature.modify && secondaryFeature.modify[attribute]) {
      features.push(secondaryFeature);
    }
  }

  // armor
  if (character.equipment && character.equipment.armor.name) {
    const armorFeature = equipmentFeatures.find(
      (feature) => feature.name === character.equipment.armor.feature,
    );
    const armorScore = options.exclude && options.exclude.includes('armorScore')
      ? 0
      : character.equipment.armor.score;

    features.push({
      name: character.equipment.armor.name,
      modify: {
        armorScore,
      },
    });

    if (armorFeature && armorFeature.modify && armorFeature.modify[attribute]) {
      features.push(armorFeature);
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
