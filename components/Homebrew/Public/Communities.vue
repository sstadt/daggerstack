<template lang="pug">
  .py-4
    .space-y-8
      .flex.space-x-2
        InputText.flex-grow(label="search" v-model="search")
        button.u-inline-button.px-2.flex.items-center.justify-center(
          type="button"
          @click="filters.open"
        )
          NuxtIcon.text-3xl(name="filters")
          .sr-only Filter Items
      transition(name="fade" mode="out-in")
        BasicLoader.mx-auto.mt-8(v-if="!userStore.loaded && !communityStore.publicHydrated")
        .space-y-4(v-else)
          .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
            TransitionGroup(name="slide-fade-left")
              HomebrewCardControls(
                v-for="community in searchCommunities"
                :key="community.id"
                :homebrew-id="community.id"
                :bookmarks="bookmarks"
                @add-bookmark="addBookmark(community.id)"
                @remove-bookmark="removeBookmark(community.id)"
              )
                CardCommunity.h-full(:community="community")
</template>

<script>
  export default {
    name: 'HomebrewPublicWeapons',
  };
</script>

<script setup>
  import { createSelectOptions } from '~/helpers/array';
  import { waitUntil } from '~/helpers/utility';

  const userStore = useUserStore();
  const communityStore = useCommunityStore();

  const search = ref('');

  const searchCommunities = computed(() => {
    return communityStore.publicCommunities.filter((community) => {
      return search.value.length > 0
        ? community.name.toLowerCase().includes(search.value.toLowerCase())
        : true;
    });
  });

  const bookmarks = computed(() => {
    return userStore.profile?.communities || [];
  });

  onMounted(() => {
    waitUntil(() => userStore.user?.id).then(() => {
      if (!communityStore.publicHydrated) {
        communityStore.hydratePublic();
      }
    });
  });

  const addBookmark = (id) => {
    userStore.addHomebrew('communities', id);
    communityStore.bookmarkAdded(id);
  };

  const removeBookmark = (id) => {
    userStore.removeHomebrew('communities', id);
    communityStore.bookmarkRemoved(id);
  };
</script>
