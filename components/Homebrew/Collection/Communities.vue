<template lang="pug">
  .py-8
    .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
      TransitionGroup(name="slide-fade-left")
        .relative(
          v-for="community in communityStore.homebrew"
          :key="community.id"
        )
          NuxtIcon.absolute.top-0.right-14.text-red-900.text-xl(
            v-if="bookmarks.includes(community.id)"
            name="bookmark"
          )
          HomebrewCardCommunity.cursor-pointer.h-full(
            :community="community"
            @click="editArmor(community)"
          )
    BasicButton.fixed.bottom-20.right-6.shadow(
      size="sm"
      priority="secondary"
      icon
      @click="newItem"
    )
      NuxtIcon(name="plus")
      span.sr-only New Item
    HomebrewDrawerCommunity(ref="drawer" @save="saveArmor" @delete="deleteArmor")
</template>

<script>
  export default {
    name: 'HomebrewCollectionCommunities',
  };
</script>

<script setup>
  const userStore = useUserStore();
  const communityStore = useCommunityStore();
  const toastStore = useToastStore();

  const drawer = ref(null);

  const bookmarks = computed(() => {
    return userStore.profile?.armor || [];
  });

  const newItem = () => {
    drawer.value.open();
  };

  const editArmor = (armor) => {
    if (!bookmarks.value.includes(armor.id)) drawer.value.open(armor);
  };

  const saveArmor = (armor) => {
    communityStore.saveArmor(armor);
  };

  const deleteArmor = async (id) => {
    communityStore.deleteArmor(id);
  };
</script>
