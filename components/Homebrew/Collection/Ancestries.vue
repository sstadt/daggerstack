<template lang="pug">
  .py-8
    .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
      TransitionGroup(name="slide-fade-left")
        .relative(
          v-for="community in ancestryStore.homebrew"
          :key="community.id"
        )
          NuxtIcon.absolute.top-0.right-14.text-red-900.text-xl(
            v-if="bookmarks.includes(community.id)"
            name="bookmark"
          )
          CardCommunity.cursor-pointer.h-full(
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
    HomebrewDrawerAncestry(ref="drawer" @save="saveAncestry" @delete="deleteAncestry")
</template>

<script>
  export default {
    name: 'HomebrewCollectionAncestries',
  };
</script>

<script setup>
  const userStore = useUserStore();
  const ancestryStore = useAncestryStore();
  const toastStore = useToastStore();

  const drawer = ref(null);

  const bookmarks = computed(() => {
    return userStore.profile?.ancestries || [];
  });

  const newItem = () => {
    drawer.value.open();
  };

  const editArmor = (ancestry) => {
    if (!bookmarks.value.includes(ancestry.id)) drawer.value.open(ancestry);
  };

  const saveAncestry = (ancestry) => {
    ancestryStore.saveAncestry(ancestry);
  };

  const deleteAncestry = async (id) => {
    ancestryStore.deleteAncestry(id);
  };
</script>
