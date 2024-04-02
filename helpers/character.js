// TODO: import class data and fill in starting values

export const newCharacter = (character) => {
  const defaults = {
    name: '',
    baseClass: '',
    subclass: '',
  };

  const options = Object.assign({}, defaults, character);

  return {
    name: options.name,
    description: '',
    baseClass: options.baseClass,
    subclass: options.subclass,
    heritage: '',
    agility: {
      score: null,
      upgraded: false,
    },
    strength: {
      score: null,
      upgraded: false,
    },
    finesse: {
      score: null,
      upgraded: false,
    },
    instinct: {
      score: null,
      upgraded: false,
    },
    presense: {
      score: null,
      upgraded: false,
    },
    knowledge: {
      score: null,
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
