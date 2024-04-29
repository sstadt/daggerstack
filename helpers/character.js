import { uuidv4 } from '~/helpers/utility';

import general from '~/data/general';
import classes from '~/data/classes';

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

export const calculateModifiers = (upgrades, attribute) => {
  let score = 0;

  if (upgrades.length > 0) {
    score += upgrades.reduce((bonus, feature) => {
      if (feature.modify && feature.modify[attribute] !== undefined) {
        bonus += feature.modify[attribute];
      }

      return bonus;
    }, 0);
  }

  return score;
};
