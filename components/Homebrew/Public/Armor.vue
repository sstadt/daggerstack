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
        BasicLoader.mx-auto.mt-8(v-if="!userStore.loaded && !armorStore.publicHydrated")
        .space-y-4(v-else)
          .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
            TransitionGroup(name="slide-fade-left")
              HomebrewCardControls(
                v-for="armor in searchArmor"
                :key="armor.id"
                :homebrew-id="armor.id"
                :bookmarks="bookmarks"
                @add-bookmark="addBookmark(armor.id)"
                @remove-bookmark="removeBookmark(armor.id)"
              )
                HomebrewCardArmor.h-full(:armor="armor")
    BasicDrawer(title="filters" ref="filters")
      .px-4.space-y-4
        InputChecklist(label="tier" v-model="armorTier" :cols="4" :options="tierOptions")
      .px-4.space-y-2.mt-auto
        BasicButton.w-full(priority="secondary" @click="resetFilters") Reset
        BasicButton.w-full(@click="filters.close") Show Results
</template>

<script>
  export default {
    name: 'HomebrewPublicArmor',
  };
</script>

<script setup>
  import { createSelectOptions } from '~/helpers/array';
  import { waitUntil } from '~/helpers/utility';

  const userStore = useUserStore();
  const armorStore = useArmorStore();

  const tierOptions = createSelectOptions([1, 2, 3, 4]);

  const search = ref('');
  const armorTier = ref([]);
  const filters = ref(null);

  const filteredArmor = computed(() => {
    return armorStore.publicArmor.filter((item) => {
      return armorTier.value.length < 1 || armorTier.value.includes(item.tier);
    });
  });

  const searchArmor = computed(() => {
    return filteredArmor.value.filter((armor) => {
      return search.value.length > 0
        ? armor.name.toLowerCase().includes(search.value.toLowerCase())
        : true;
    });
  });

  const bookmarks = computed(() => {
    return userStore.profile?.armor || [];
  });

  onMounted(() => {
    waitUntil(() => userStore.user?.id).then(() => {
      if (!armorStore.publicHydrated) {
        armorStore.hydratePublic();
      }
    });
  });

  const addBookmark = (id) => {
    userStore.addHomebrew('armor', id);
    armorStore.bookmarkAdded(id);
  };

  const removeBookmark = (id) => {
    userStore.removeHomebrew('armor', id);
    armorStore.bookmarkRemoved(id);
  };

  const resetFilters = () => {
    armorTier.value = [];
    filters.value.close();
  };
</script>
