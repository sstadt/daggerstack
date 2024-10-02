
/**
 * Get a base item's type, used for sorting/filtering
 *
 * @param {Object} item The item to check
 * @returns String identifying the type of item
 */
export const getItemType = (item) => {
  if (item.onShortRest || item.onLongRest) return 'downtime';
  if (item.consumable) return 'consumable';
  if (item.relic) return 'relic';
  if (item.attach) return 'attachment';
  if (item.downtime?.craft) return 'recipe';

  return 'basic';
};
