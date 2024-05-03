
import { uuidv4 } from '~/helpers/utility';

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
    version: '1.2',
    name: '',
    pronouns: '',
    description: '',
    baseClass: '',
    subclass: [],
    multiClass: [],
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
      slots: 3,
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
      slots: 5,
    },
    hope: 2,
    proficiency: 1,
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
        hoard: 0,
        fortune: 0,
      },
      weapon: {
        name: null,
        primary: false,
        secondary: false,
        trait: null,
        range: null,
        damage: null,
        damageType: null,
        feature: null,
        secondaryFeature: null,
        burden: 0,
      },
    },
    experience: [],
    background: [],
    connection: [],
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

/**
 * Inventory items are stores as a single string, this function
 * breaks that master string down to be loaded into the character
 * builder when loading a saved character from localStorage.
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
 * Get all character sheet features that modify a given attribute
 *
 * @param {Object} character The character to compile modifiers for
 * @param {attribute} attribute The attribute to compile modifiers for
 * @returns An array of features
 */
export const getFeaturesByAttribute = (character, attribute) => {
  const burden =
    character.equipment.primaryWeapon.burden + character.equipment.secondaryWeapon.burden;
  const subclasses = character.subclass.map((characterSubclass) => {
    return allSubclasses.find((subclass) => subclass.name === characterSubclass.name);
  });
  const community = COMMUNITY.find((community) => character.community === community.name);
  const ancestry = ANCESTRY.find((ancestry) => character.ancestry === ancestry.name);
  const features = [];

  // weapons
  if (character.equipment.primaryWeapon.feature) {
    const primaryFeature = equipmentFeatures.find(
      (feature) => feature.name === character.equipment.primaryWeapon.feature,
    );

    if (primaryFeature && primaryFeature.modify && primaryFeature.modify[attribute]) {
      features.push(primaryFeature);
    }
  }

  // verify we are not carrying too much before including secondary weapon feature
  if (burden < 3 && character.equipment.secondaryWeapon.secondaryFeature) {
    const secondaryFeature = equipmentFeatures.find(
      (feature) => feature.name === character.equipment.secondaryWeapon.secondaryFeature,
    );

    if (secondaryFeature && secondaryFeature.modify && secondaryFeature.modify[attribute]) {
      features.push(secondaryFeature);
    }
  }

  // armor
  if (character.equipment.armor.name) {
    const armorFeature = equipmentFeatures.find(
      (feature) => feature.name === character.equipment.armor.feature,
    );

    features.push({
      name: character.equipment.armor.name,
      modify: {
        armorScore: character.equipment.armor.score,
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

      // add foundation
      if (subclassData.foundation[attribute]) {
        features.push({
          name: `${subclass.name} (foundation)`,
          modify: { ...subclassData.foundation },
        });
      }

      // add specialization
      if (
        subclass.rank !== 'foundation' &&
        subclassData.specialization[attribute]
      ) {
        features.push({
          name: `${subclass.name} (specialization)`,
          modify: { ...subclassData.specialization },
        });
      }

      // add mastery
      if (
        subclass.rank === 'mastery' &&
        subclassData.mastery[attribute]
      ) {
        features.push({
          name: `${subclass.name} (mastery)`,
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

  return features;
};
