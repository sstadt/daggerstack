
import COMMUNITY from '~/data/community';
import ANCESTRY from '~/data/ancestry';
import SUBCLASSES from '~/data/subclasses';

let allSubclasses = [];
for (const [key] of Object.entries(SUBCLASSES)) {
  allSubclasses = allSubclasses.concat(SUBCLASSES[key]);
}

export const useSheetBonuses = () => {
  const weaponsStore = useWeaponsStore();
  const armorStore = useArmorStore();

  const getFeaturesByAttribute = (character, attribute, options = {}) => {
    const weapons = character.inventory?.weapons
      .filter((characterWeapon) => characterWeapon.equipped)
      .map((characterWeapon) => {
        return { ...weaponsStore.weapon(characterWeapon.itemId) };
      });
    const subclasses = character.subclass
      ? character.subclass.map((characterSubclass) => {
          return allSubclasses.find((subclass) => subclass.name === characterSubclass);
        })
      : [];
    const community = character.community
      ? COMMUNITY.find((community) => character.community === community.name)
      : null;
    const ancestry = character.ancestry
      ? character.ancestry.map((ancestryName) => {
          return ANCESTRY.find((ancestry) => ancestry.name === ancestryName);
        })
      : null;
    const features = [];

    // weapons
    if (weapons) {
      weapons.forEach((weapon) => {
        if (weapon.feature) features.push({ ...weapon.feature });
      });
    }

    // items
    if (character.inventory?.items) {
      character.inventory.items
        .filter((i) => i.modify && i.modify[attribute])
        .forEach((item) => {
          features.push({
            name: item.name,
            modify: { ...item.modify },
          });
        });
    }

    // armor
    if (attribute === 'armorScore' && character.inventory?.armor?.itemId) {
      const armor = armorStore.armor(character.inventory.armor.itemId);
      const armorScore = options.exclude && options.exclude.includes('armorScore')
        ? 0
        : armor.score;

      features.push({
        name: armor.name,
        modify: {
          armorScore,
        },
      });

      if (armor.feature && armor.feature.modify && armor.feature.modify[attribute]) {
        features.push({ ...armor.feature });
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
        if (subclassData.foundation[attribute]) {
          features.push({
            name: `${subclass} (foundation)`,
            modify: { ...subclassData.foundation },
          });
        }

        // add specialization for applicable
        if (numUpgrades > 0 && subclassData.specialization[attribute]) {
          features.push({
            name: `${subclass} (specialization)`,
            modify: { ...subclassData.specialization },
          });
        }

        // add mastery for applicable
        if (numUpgrades > 1 && subclassData.mastery[attribute]) {
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
      const [ topAncestry, bottomAncestry ] = ancestry;
      const [ topFeature ] = topAncestry.features;
      const [ _, bottomFeature ] = ancestry.length > 1
        ? bottomAncestry.features
        : topAncestry.features;

      if (topFeature.modify && topFeature.modify[attribute]) {
        features.push({ ...topFeature });
      }

      if (bottomFeature.modify && bottomFeature.modify[attribute]) {
        features.push({ ...bottomFeature });
      }
    }

    // tier selections
    character.levelSelections.forEach((selection) => {
      if (
        selection.type === attribute ||
        Array.isArray(selection.options) && selection.options.includes(attribute)
      ) {
        const feature = {
          name: `Level ${selection.level} (selection)`,
          modify: {},
        };

        feature.modify[attribute] = selection.value;
        features.push(feature);
      }
    });

    // buffs
    if (character.buffs) {
      character.buffs.forEach((buff) => {
        if (buff.enabled && buff.modify.hasOwnProperty(attribute)) {
          const feature = { ...buff };

          feature.name = `${buff.name} (status effect)`;
          features.push(feature);
        }
      });
    }

    return features;
  };

  const calculateModifiers = (features, attribute) => {
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

  return {
    getFeaturesByAttribute,
    calculateModifiers,
  };
};