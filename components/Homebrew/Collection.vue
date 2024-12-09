<template lang="pug">
  .overflow-hidden
    .sticky.top-0.z-10.relative.transition-colors.bg-black
      .max-w-5xl.container.sheet-header__title.flex-none.py-4.text-white.cursor-pointer(
        :class="{ 'container': mq.lgPlus }"
      )
        .flex.items-center.space-x-2
          NuxtLink.text-lg.uppercase.text-slate-300.font-light(to="/homebrew") Homebrew
          NuxtIcon.text-sm(name="chevron-right")
          p.font-bold.text-lg.uppercase.text-slate-300 Collection
        h1.font-bold.text-5xl.uppercase.truncate {{ activeTab.name }}
      .max-w-5xl.mx-auto.flex.relative
        NavButton(
          v-for="tab in tabs"
          :icon="tab.icon"
          :style="tabButtonStyle"
          @click="setTab(tab)"
        )
        .absolute.bottom-0.h-2.bg-white.pointer-events-none.transition-all.translate-y-px(
          :style="tabIndicatorStyle"
        )
    .max-w-5xl.container
      transition(:name="tabTransition" mode="out-in")
        component(:is="tabComponents[activeTab.name]")
</template>

<script>
  export default {
    name: 'HomebrewCollection',
    inject: ['mq'],
  };
</script>

<script setup>
  const tabComponents = {
    'Items': resolveComponent('HomebrewCollectionItems'),
    'Weapons': resolveComponent('HomebrewCollectionWeapons'),
    'Armor': resolveComponent('HomebrewCollectionArmor'),
    'Community': resolveComponent('HomebrewCollectionCommunities'),
  };
  const tabs = [
    { id: 'items', name: 'Items', icon: 'gem-pendant' },
    { id: 'weapons', name: 'Weapons', icon: 'axe' },
    { id: 'armor', name: 'Armor', icon: 'armor' },
    { id: 'community', name: 'Community', icon: 'city' },
  ];
  const { activeTab, tabTransition, setTab, useActiveTabIndex } = useTabs(tabs);
  const activeTabIndex = useActiveTabIndex();

  const tabButtonWidth = computed(() => {
    return 100 / tabs.length;
  });

  const tabButtonStyle = computed(() => {
    return {
      width: `${tabButtonWidth.value}%`,
    };
  });

  const tabIndicatorStyle = computed(() => {
    return {
      width: `${tabButtonWidth.value}%`,
      left: `${activeTabIndex.value * tabButtonWidth.value}%`,
    };
  });
</script>
