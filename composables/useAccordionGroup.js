
export const useAccordionGroup = (startingAccordionName) => {
  const activeAccordion = ref(startingAccordionName);

  const setActiveAccordion = (id) => {
    activeAccordion.value = id;
  };

  return {
    activeAccordion,
    setActiveAccordion,
  };
};
