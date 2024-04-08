import { uuidv4 } from '~/helpers/utility';

import general from '~/data/general';
import classes from '~/data/classes';
// TODO: import class data and fill in starting values

export const newCharacter = (character) => {
  const defaults = {
    name: '',
    baseClass: '',
    subclass: '',
  };

  const options = Object.assign({}, defaults, character);

  return {
    id: uuidv4(),
    name: options.name,
    pronouns: '',
    description: '',
    baseClass: options.baseClass,
    subclass: options.subclass,
    heritage: '',
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
      weapon: {
        name: '',
        trait: '',
        damage: '',
        feature: '',
      },
      armor: {
        name: '',
        score: '',
        feature: '',
      },
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
        name: '',
        trait: '',
        damage: '',
        feature: '',
      },
      armor: {
        name: '',
        score: '',
        feature: '',
      },
    },
    experience: [],
    background: [],
    connection: [],
  };
};

export const newWeapon = (weapon) => {
  const defaults = {
    name: '',
    trait: '',
    damage: '',
    feature: '',
  };

  const options = Object.assign({}, defaults, weapon);

  return {
    name: options.name,
    trait: options.trait,
    damage: options.damage,
    feature: options.feature,
  };
};

export const newArmor = (armor) => {
  const defaults = {
    name: '',
    score: '',
    feature: '',
  };

  const options = Object.assign({}, defaults, armor);

  return {
    name: options.name,
    score: options.score,
    feature: options.feature,
  };
};

export const separateItemsForBuilder = (items, baseClass) => {
  const itemArr = items !== '' ? items.split(',').map((item) => item.trim()) : [];
  const spellbookIndex = itemArr.findIndex((item) => item.includes('spellbook'));
  const [existingSpellbook] = spellbookIndex > -1
    ? itemArr.splice(spellbookIndex, 1)
    : [''];
  const spellbook = existingSpellbook.replace('(spellbook)', '').trim();

  let generalItem = '';
  let classItem = '';

  general.startingGear.choose.forEach((choice) => {
    const itemIndex = itemArr.findIndex((item) => item === choice);

    if (itemIndex > -1) {
      generalItem = itemArr.splice(itemIndex, 1);
    }
  });

  if (baseClass) {
    classes[baseClass].startingGear.choose
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
      : general.startingGear.take.join(', '),
    spellbook,
    generalItem,
    classItem,
  };
};
