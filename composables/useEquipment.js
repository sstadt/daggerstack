
export const useEquipment = () => {
  const useIsHomebrew = (equipment) => {
    return computed(() => {
      return Number.isInteger(equipment?.id);
    });
  };

  const useTitleClass = (equipment) => {
    return computed(() => {
      return {
        'text-blue-600': equipment?.tier === 2,
        'text-purple-700': equipment?.tier === 3,
        'text-orange-600': equipment?.tier === 4,
      }
    });
  };

  const modifierString = (mod) => {
    return mod > 0 ? `+${mod}` : mod;
  };

  return {
    useIsHomebrew,
    useTitleClass,
    modifierString,
  };
};
