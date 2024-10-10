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
        BasicLoader.mx-auto.mt-8(v-if="!userStore.loaded && !weaponsStore.publicHydrated")
        .space-y-4(v-else)
          .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
            TransitionGroup(name="slide-fade-left")
              .rounded.relative.transition-all.overflow-hidden.group(
                v-for="weapon in searchWeapons"
                :key="weapon.id"
                class="hover:shadow focus:shadow"
              )
                HomebrewCardItem.h-full(:weapon="weapon")
                transition(name="slide-fade-top")
                  NuxtIcon.absolute.top-0.right-14.text-red-900.text-xl(
                    v-if="bookmarks.includes(weapon.id)"
                    name="bookmark"
                  )
                BasicButton.rounded-tl.absolute.bottom-0.right-0.translate-y-full.transition-all(
                  size="xs"
                  :priority="bookmarks.includes(weapon.id) ? 'danger' : 'primary'"
                  rounded="none"
                  class="group-hover:translate-y-0 group-focus:translate-y-0 focus:translate-y-0"
                  :disabled="userStore.pendingSave.includes(weapon.id)"
                  @click="toggleBookmark(weapon.id)"
                )
                  span(v-if="bookmarks.includes(weapon.id)")
                    NuxtIcon.mr-1(name="times")
                    | Remove
                  span(v-else)
                    NuxtIcon.mr-1(name="plus")
                    | Add
    BasicDrawer(title="filters" ref="filters")
      .px-4
        .space-y-4
          p todo: filter options
      .px-4.space-y-2.mt-auto
        BasicButton.w-full(priority="secondary" @click="resetFilters") Reset
        BasicButton.w-full(@click="filters.close") Show Results
</template>

<script>
  export default {
    name: 'HomebrewPublicWeapons',
  };
</script>

<script setup>
  import { waitUntil } from '~/helpers/utility';

  const userStore = useUserStore();
  const weaponsStore = useWeaponsStore();

  const search = ref('');
  const filters = ref(null);

  const filteredWeapons = computed(() => {
    return weaponsStore.publicItems.filter((item) => {
      return true;
    });
  });

  const searchWeapons = computed(() => {
    return filteredWeapons.value.filter((weapon) => {
      return search.value.length > 0
        ? weapon.name.toLowerCase().includes(search.value.toLowerCase())
        : true;
    });
  });

  const bookmarks = computed(() => {
    return userStore.profile?.weapons || [];
  });

  onMounted(() => {
    waitUntil(() => userStore.user?.id).then(() => {
      if (!weaponsStore.publicHydrated) {
        weaponsStore.hydratePublic();
      }
    });
  });

  const toggleBookmark = (id) => {
    if (bookmarks.value.includes(id)) {
      userStore.removeHomebrew('weapons', id);
      weaponsStore.bookmarkRemoved(id);
    } else {
      userStore.addHomebrew('weapons', id);
      weaponsStore.bookmarkAdded(id);
    }
  };

  const resetFilters = () => {
    type.value = '';
    filters.value.close();
  };
</script>
