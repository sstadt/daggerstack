
export const useWeapon = () => {
  const useShowMainHand = (weapon) => {
    return weapon.slot === 'primary';
  };

  const useShowOffHand = (weapon) => {
    return weapon.burden > 1 || weapon.slot === 'secondary';
  };

  return {
    useShowMainHand,
    useShowOffHand,
  };
};
