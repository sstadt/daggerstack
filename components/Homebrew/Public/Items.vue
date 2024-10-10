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
        BasicLoader.mx-auto.mt-8(v-if="!userStore.loaded && !itemsStore.publicHydrated")
        .space-y-4(v-else)
          .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
            TransitionGroup(name="slide-fade-left")
              HomebrewCardControls(
                v-for="item in searchItems"
                :key="item.id"
                :homebrew-id="item.id"
                :bookmarks="bookmarks"
              )
                HomebrewCardItem.h-full(:item="item")
    BasicDrawer(title="filters" ref="filters")
      .px-4
        .space-y-4
          InputSelect(label="type" v-model="type" :options="itemTypeOptions")
          InputSelect(
            label="has charges"
            v-model="itemHasCharges"
            :options="optionalBooleanOptions"
            required
          )
          InputSelect(
            label="is bookmarkes"
            v-model="itemIsBookmarked"
            :options="optionalBooleanOptions"
            required
          )
      .px-4.space-y-2.mt-auto
        BasicButton.w-full(priority="secondary" @click="resetFilters") Reset
        BasicButton.w-full(@click="filters.close") Show Results
</template>

<script>
  export default {
    name: 'HomebrewPublicItems',
  };
</script>

<script setup>
  import { itemTypeOptions } from '~/config/items';
  import { getItemType, hasCharges } from '~/helpers/item';
  import { waitUntil } from '~/helpers/utility';

  const userStore = useUserStore();
  const itemsStore = useItemsStore();

  const search = ref('');
  const type = ref('');
  const itemHasCharges = ref('any');
  const itemIsBookmarked = ref('any');
  const filters = ref(null);

  const optionalBooleanOptions = [
    { label: 'Any', value: 'any' },
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  const filteredItems = computed(() => {
    return itemsStore.publicItems.filter((item) => {
      const matchesType = type.value === '' || type.value === getItemType(item);
      const matchesCharges =
        itemHasCharges.value === 'any' ||
        itemHasCharges.value === 'yes' && hasCharges(item) ||
        itemHasCharges.value === 'no' && !hasCharges(item);
      const matchesBookmarked =
        itemIsBookmarked.value === 'any' ||
        itemIsBookmarked.value === 'yes' && userStore.profile.items.includes(item.id) ||
        itemIsBookmarked.value === 'no' && !userStore.profile.items.includes(item.id);

      return matchesType && matchesCharges && matchesBookmarked;
    });
  });

  const searchItems = computed(() => {
    return filteredItems.value.filter((item) => {
      return search.value.length > 0
        ? item.name.toLowerCase().includes(search.value.toLowerCase())
        : true;
    });
  });

  const bookmarks = computed(() => {
    return userStore.profile?.items || [];
  });

  onMounted(() => {
    waitUntil(() => userStore.user?.id).then(() => {
      if (!itemsStore.publicHydrated) {
        itemsStore.hydratePublic();
      }
    });
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

  const resetFilters = () => {
    type.value = '';
    itemHasCharges.value = 'any';
    itemIsBookmarked.value = 'any';
    filters.value.close();
  };
</script>
