
import { uuidv4 } from '~/helpers/utility';

import GENERAL from '~/data/general';

/**
 * Create a new character
 * Used to stub out a character in the builder
 *
 * @returns A new character object
 */
export const newCharacter = () => {
  return {
    version: GENERAL.currentCharacterVersion,
    name: '',
    pronouns: '',
    description: '',
    baseClass: '',
    subclass: [],
    community: '',
    ancestry: [],
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
      gold: 1,
      weapons: [],
      armor: newArmor(),
    },
    experience: [],
    background: [],
    connection: [],
    levelSelections: [],
    buffs: [],
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

/**
 * Create a new character weapon
 * This is an aggregate object with a reference to the original weapon,
 * allowing this to track attachments and notes without modifying the
 * attributes of the original weapon.
 *
 * @param {Object} weapon The weapon options
 * @returns The weapon object
 */
export const newWeapon = (weapon = {}) => {
  const defaults = {
    id: uuidv4(),
    itemId: null,
    name: null,
    equipped: false,
    notes: '',
  };
  const options = Object.assign({}, defaults, weapon);

  return {
    id: options.id,
    itemId: options.itemId,
    name: options.name,
    equipped: options.equipped,
    notes: options.notes,
  };
};

/**
 * Create new character armor
 * This is an aggregate object with a reference to the original armor,
 * allowing this to track attachments and notes without modifying the
 * attributes of the original armor.
 *
 * @param {Object} armor The armor options
 * @returns The armor object
 */
export const newArmor = (armor = {}) => {
  const defaults = {
    id: uuidv4(),
    itemId: null,
    name: null,
    equipped: false,
    notes: '',
    attachment: null,
  };
  const options = Object.assign({}, defaults, armor);

  return {
    id: options.id,
    itemId: options.itemId,
    name: options.name,
    equipped: options.equipped,
    notes: options.notes,
    attachment: options.attachment,
  };
};

/**
 * Create a new character item
 * This is an aggregate object with a reference to the original item,
 * allowing this to track attachments, charges, notes, etc. without
 * modifying the attributes of the original item.
 *
 * @param {Object} item The item options
 * @returns The item object
 */
export const newItem = (item = {}) => {
  const defaults = {
    id: uuidv4(),
    itemId: `custom-${uuidv4()}`,
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
    itemId: options.itemId,
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

/**
 * Create a new level upgrade
 * Used with character and companion leveling
 *
 * @param {Object} upgrade The upgrade options
 * @returns The upgrade object
 */
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
 * Create a new Status Effect (buff)
 * Used with the Status Effects feature
 *
 * @param {Object} buff The buff options
 * @returns The new buff object
 */
export const newStatusEffect = (buff = {}) => {
  const defaults = {
    name: '',
    enabled: false,
    scar: false,
    modify: {},
  };
  const options = Object.assign({}, defaults, buff);

  return {
    id: uuidv4(),
    name: options.name,
    enabled: options.enabled,
    scar: options.scar,
    modify: { ...options.modify },
  };
};

/**
 * Create a buff object; used for putting together
 * homebrew and status effects
 *
 * @param {Object} buff The buff object with a stat and a score
 * @returns
 */
export const newBuff = (buff = {}) => {
  const defaults = {
    stat: '',
    score: 1,
  };
  const options = Object.assign({}, defaults, buff);

  return {
    stat: options.stat,
    score: options.score,
  };
};

/**
 * Create a feature object; used for putting together
 * homebrew features with modifiers
 *
 * @param {Object} feature The feature options
 * @returns
 */
export const newFeature = (feature = {}) => {
  const defaults = {
    name: '',
    description: '',
    modify: [],
  };
  const options = Object.assign({}, defaults, feature);

  return {
    name: options.name,
    description: options.description,
    modify: [ ...options.modify ],
  };
};
