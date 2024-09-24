
export const useItem = () => {

  const useTitleClass = (item) => {
    return computed(() => {
      return {
        'text-cyan-950': !item.consumable && !item.relic && !item.attach,
        'text-green-600': item.consumable,
        'text-green-800': item.downtime?.craft,
        'text-orange-600': item.relic,
        'text-pink-800': item.attach,
      }
    });
  };

  const modifierString = (mod) => {
    return mod > 0 ? `+${mod}` : mod;
  };

  return {
    useTitleClass,
    modifierString,
  }
};
