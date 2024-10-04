<template lang="pug">
  .py-8
    transition(name="fade" mode="out-in")
      BasicLoader.mx-auto.my-8(v-if="!userStore.loaded && !itemsStore.publicHydrated")
      .space-y-4(v-else)
        .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
          .rounded.relative.transition-all.overflow-hidden.group(
            v-for="item in itemsStore.publicItems"
            :key="item.id"
            class="hover:shadow focus:shadow"
          )
            HomebrewCardItem.h-full(:item="item")
            transition(name="slide-fade-top")
              NuxtIcon.absolute.top-0.right-14.text-red-900.text-xl(
                v-if="bookmarks.includes(item.id)"
                name="bookmark"
              )
            BasicButton.rounded-tl.absolute.bottom-0.right-0.translate-y-full.transition-all(
              size="xs"
              :priority="bookmarks.includes(item.id) ? 'danger' : 'primary'"
              rounded="none"
              class="group-hover:translate-y-0 group-focus:translate-y-0 focus:translate-y-0"
              :disabled="userStore.pendingSave.includes(item.id)"
              @click="toggleBookmark(item.id)"
            )
              span(v-if="bookmarks.includes(item.id)")
                NuxtIcon.mr-1(name="times")
                | Remove
              span(v-else)
                NuxtIcon.mr-1(name="plus")
                | Add
</template>

<script>
  export default {
    name: 'HomebrewPublicItems',
  };
</script>

<script setup>
  import { waitUntil } from '~/helpers/utility';

  const userStore = useUserStore();
  const itemsStore = useItemsStore();

  onMounted(() => {
    waitUntil(() => userStore.user?.id).then(() => {
      if (!itemsStore.publicHydrated) {
        itemsStore.hydratePublic();
      }
    });
  });

  const bookmarks = computed(() => {
    return userStore.profile?.items || [];
  });

  const toggleBookmark = (id) => {
    if (bookmarks.value.includes(id)) {
      userStore.removeHomebrew('items', id);
      itemsStore.bookmarkRemoved(id);
    } else {
      userStore.addHomebrew('items', id);
      itemsStore.bookmarkAdded(id);
    }
  };
</script>
