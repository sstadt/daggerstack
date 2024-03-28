import schema from 'schm';
import weaponSchema from '~/schema/character/weapom';
import armorSchema from '~/schema/character/armor';
import goldSchema from '~/schema/character/gold';

export default inventorySchema = schema({
  items: String,
  gold: goldSchema,
  weapon: weaponSchema,
  armor: armorSchema,
});
