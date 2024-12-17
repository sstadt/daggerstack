<template lang="pug">
  .py-4
    .space-y-8
      .flex.space-x-2
        InputText.flex-grow(label="search" v-model="search")
      transition(name="fade" mode="out-in")
        BasicLoader.mx-auto.mt-8(v-if="!userStore.loaded && !ancestryStore.publicHydrated")
        .space-y-4(v-else)
          .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
            TransitionGroup(name="slide-fade-left")
              HomebrewCardControls(
                v-for="ancestry in searchAncestries"
                :key="ancestry.id"
                :homebrew-id="ancestry.id"
                :bookmarks="bookmarks"
                @add-bookmark="addBookmark(ancestry.id)"
                @remove-bookmark="removeBookmark(ancestry.id)"
              )
                CardAncestry.h-full(:ancestry="ancestry")
</template>

<script>
  export default {
    name: 'HomebrewPublicAncestries',
  };
</script>

<script setup>
  import { createSelectOptions } from '~/helpers/array';
  import { waitUntil } from '~/helpers/utility';

  const userStore = useUserStore();
  const ancestryStore = useAncestryStore();

  const search = ref('');

  const searchAncestries = computed(() => {
    return ancestryStore.publicAncestries.filter((ancestry) => {
      return search.value.length > 0
        ? ancestry.name.toLowerCase().includes(search.value.toLowerCase())
        : true;
    });
  });

  const bookmarks = computed(() => {
    return userStore.profile?.ancestries || [];
  });

  onMounted(() => {
    waitUntil(() => userStore.user?.id).then(() => {
      if (!ancestryStore.publicHydrated) {
        ancestryStore.hydratePublic();
      }
    });
  });

  const addBookmark = (id) => {
    userStore.addHomebrew('ancestries', id);
    ancestryStore.bookmarkAdded(id);
  };

  const removeBookmark = (id) => {
    userStore.removeHomebrew('ancestries', id);
    ancestryStore.bookmarkRemoved(id);
  };
</script>
