
/**
 * Migrations should provide an isValid and migrate method on
 * an object.
 *
 * isValid should take a character object and return true if the
 * character matches the expected output format for the migration
 *
 * migrate should take the character object, clone it, and then
 * return the character with any relevant migrations performed.
 * The updated character should then return true from the isValid
 * method.
 *
 * To automatically apply migrations when characters are hydrated,
 * add the migration object to the "migrations" array.
 *
 * To test a migration before allowing the app to save character
 * changes, set the 'dev' attribute on a migration object to true
 */

import GENERAL from '~/data/general';
import { items } from '~/data/items';
import WEAPONS from '~/data/weapons';
import ARMOR from '~/data/armor';
import COMMUNITY from '~/data/community';
import { clone, uuidv4 } from '~/helpers/utility';
import { newWeapon, newArmor } from '~/helpers/constructors';

/**
 * Gold Consolidation
 *
 * Consolidate gold bags and chests into handfuls. Changes
 * the character.inventory.gold attribute to remove goldhandful,
 * goldBag, and goldChest. Replaces the gold object with an
 * integer representing the total handfuls of gold.
 *
 * Conversion rate is dictated by GENERAL.gold.handfulsPerBag
 * and GENERAL.gold.bagsPerChest
 */
const goldConsolidation = {
  isValid(character) {
    return Number.isInteger(character.inventory.gold);
  },
  migrate(character) {
    const updatedCharacter = clone(character);
    const { handful, bag, chest } = updatedCharacter.inventory.gold;

    // merge gold into pure handfuls
    updatedCharacter.inventory.gold = parseInt(handful || 0) +
      (parseInt(bag || 0, 10) * GENERAL.gold.handfulsPerBag) +
      (parseInt(chest || 0, 10) * GENERAL.gold.bagsPerChest * GENERAL.gold.handfulsPerBag);

    return updatedCharacter;
  },
};

/**
 * Item IDs
 *
 * Migrate items that were previously identified by name in search to
 * add the itemId attribute to character items, allowing the base item
 * to be matched via ID instead of item name.
 *
 * This is necessary to allow homebrew items and base game items to be
 * used interchangeably.
 *
 * Migrations assume character has no homebrew items and only matches on
 * stock items.
 */
const itemId = {
  isValid(character) {
    // if character has no items, migration is not necessary
    if (character.inventory?.items && character.inventory?.items?.length < 1) return true;

    for (let i = 0, j = character.inventory.items.length; i < j; i++) {
      // if there is a single item without a baseItem ID, migrate the character
      if (!character.inventory.items[i].itemId) return false;
    }

    return true;
  },
  migrate(character) {
    const updatedCharacter = clone(character);
    const updatedItems = [];

    character.inventory.items.forEach((item) => {
      const baseItem = items.find((i) => i.name === item.name);

      if (baseItem) {
        item.itemId = baseItem.id;
      } else {
        item.itemId = `custom-${uuidv4()}`;
      }

      updatedItems.push(item);
    });

    updatedCharacter.inventory.items = updatedItems;

    return updatedCharacter;
  },
};

/**
 * Equipment
 *
 * Migrate characters from separate equipment object configuration
 * to including character equipment in inventory.
 *
 * Migrates old equipment assuming there is no homebrew equipment
 * configured in the old equipment configuration.
 */
const equipment = {
  isValid(character) {
    return !character.equipment;
  },
  migrate(character) {
    const updatedCharacter = clone(character);
    const primaryWeapon = { ...character.equipment.primaryWeapon };
    const primaryWeaponData = WEAPONS.items.find((w) => w.name === primaryWeapon?.name);
    const secondaryWeapon = { ...character.equipment.secondaryWeapon };
    const secondaryWeaponData = WEAPONS.items.find((w) => w.name === secondaryWeapon?.name);
    const armorData = ARMOR.items
      .find((a) => a.name === character.equipment.armor?.name);
    const armor = { ...character.equipment.armor };
    const weapons = [];

    if (primaryWeaponData) {
      primaryWeapon.equipped = true;
      primaryWeapon.itemId = primaryWeaponData.id;
      weapons.push(newWeapon(primaryWeapon));
    }

    if (secondaryWeaponData) {
      if (primaryWeaponData.burden < 2 && secondaryWeaponData.burden < 2) {
        secondaryWeapon.equipped = true;
      }

      secondaryWeapon.itemId = secondaryWeaponData.id;
      weapons.push(newWeapon(secondaryWeapon));
    }

    character.inventory.weapons.forEach((weapon) => {
      const data = WEAPONS.items.find((w) => w.name === weapon.name);

      if (data) {
        const updatedWeapon = { ...weapon };

        updatedWeapon.itemId = data.id;
        weapons.push(newWeapon(updatedWeapon));
      }
    });

    if (armorData) {
      armor.itemId = armorData.id;
      armor.equipped = true;
      updatedCharacter.inventory.armor = newArmor(armor);
    }

    updatedCharacter.inventory.weapons = clone(weapons);
    updatedCharacter.equipment = null;

    return updatedCharacter;
  },
};

const baseCommunityNames = COMMUNITY.map((c) => c.name);
const community = {
  isValid(character) {
    return !baseCommunityNames.find((name) => name === character.community);
  },
  migrate(character) {
    const updatedCharacter = clone(character);
    const baseCommunity = COMMUNITY.find(
      (community) => community.name === character.community,
    );

    updatedCharacter.community = baseCommunity.id;

    return updatedCharacter;
  },
};

const migrations = [
  goldConsolidation,
  itemId,
  equipment,
  community,
];

export default (characters) => {
  const migratedCharacters = [];
  let devMode = false;

  characters.forEach((character) => {
    migrations.forEach((migration) => {
      if (!migration.isValid(character)) {
        if (migration.dev) devMode = true;
        migratedCharacters.push(migration.migrate(character));
      }
    });
  });

  if (devMode) {
    console.log('--- TESTING MIGRATIONS ---');
    console.log(migratedCharacters);
    console.log('--- TESTING MIGRATIONS ---');
  }

  return devMode ? [] : migratedCharacters;
};
