
export const useTabs = (tabs) => {
  const activeTab = ref({ ...tabs[0] });
  const tabTransition = ref('fade');

  const setTab = (newTab) => {
    const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab.value.id);
    const newTabIndex = tabs.findIndex((tab) => tab.id === newTab.id);

    tabTransition.value = currentTabIndex < newTabIndex
      ? 'paginate-right'
      : 'paginate-left';

    nextTick(() => {
      activeTab.value = { ...newTab };
    });
  };

  const useActiveTabIndex = () => {
    return computed(() => {
      return tabs.findIndex((tab) => tab.id === activeTab.value.id);
    });
  };

  return {
    activeTab,
    tabTransition,
    setTab,
    useActiveTabIndex,
  };
};
