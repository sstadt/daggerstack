import schema from 'schm';

import armorSchema from '~/schema/character/armor';
import weaponSchema from '~/schema/character/weapom';
import inventorySchema from '~/schema/character/inventory';
import experienceSchema from '~/schema/character/experience';
import backgroundSchema from '~/schema/character/background';
import connectionSchema from '~/schema/character/connection';

const { group } = schema;

export default characterSchema = schema({
  name: String,
  pronouns: String,
  baseClass: String,
  subclass: String,
  heritage: String,
  level: Number,
  agility: group({
    score: Number,
    upgraded: Boolean,
  }),
  strength: group({
    score: Number,
    upgraded: Boolean,
  }),
  finesse: group({
    score: Number,
    upgraded: Boolean,
  }),
  instinct: group({
    score: Number,
    upgraded: Boolean,
  }),
  presence: group({
    score: Number,
    upgraded: Boolean,
  }),
  knowledge: group({
    score: Number,
    upgraded: Boolean,
  }),
  evasion: Number,
  armor: group({
    current: Number,
    slots: {
      type: Number,
      max: 9,
    },
  }),
  threshold: group({
    minor: Number,
    major: Number,
    severe: Number,
  }),
  health: group({
    current: Number,
    slots: {
      type: Number,
      max: 12,
    },
  }),
  stress: group({
    current: Number,
    slots: {
      type: Number,
      max: 9,
    },
  }),
  hope: {
    type: Number,
    max: 5,
  },
  proficiency: {
    type: Number,
    max: 6,
  },
  equipment: {
    weapon: weaponSchema,
    armor: armorSchema,
  },
  inventory: inventorySchema,
  experience: [ experienceSchema ],
  background: [ backgroundSchema ],
  connection: [ connectionSchema ],
});
