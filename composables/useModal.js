
export const useModal = () => {
  const isOpen = ref(false);

  const useDrawerClass = () => {
    return computed(() => {
      return {
        'pointer-events-none': !isOpen.value,
      };
    });
  };

  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  return {
    isOpen,
    useDrawerClass,
    open,
    close,
  };
};
