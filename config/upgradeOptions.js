
import upgradeStrings from '~/config/upgradeStrings';

const blacklist = [
  'experience',
  'companionRange',
  'companionDamage',
  'companionEvasion',
  'primaryMeleeDamage',
  'newExperience',
  'hopeSlot',
];

export default Object.keys(upgradeStrings)
  .filter((key) => !blacklist.includes(key))
  .map((key) => {
    return {
      label: upgradeStrings[key],
      value: key,
    };
  });
