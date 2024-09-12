
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
 * add the migration object to the "migrations" array
 */

import GENERAL from '~/data/general';
import { clone } from '~/helpers/utility';

/**
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

const migrations = [
  goldConsolidation,
];

export default (characters) => {
  const migratedCharacters = [];

  characters.forEach((character) => {
    migrations.forEach((migration) => {
      if (!migration.isValid(character)) {
        migratedCharacters.push(migration.migrate(character));
      }
    });
  });

  return migratedCharacters;
};
