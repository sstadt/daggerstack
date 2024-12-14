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
              HomebrewCardControls(
                v-for="weapon in searchWeapons"
                :key="weapon.id"
                :homebrew-id="weapon.id"
                :bookmarks="bookmarks"
                @add-bookmark="addBookmark(weapon.id)"
                @remove-bookmark="removeBookmark(weapon.id)"
              )
                CardWeapon.h-full(:weapon="weapon")
    BasicDrawer(title="filters" ref="filters")
      .px-4.space-y-4
        InputChecklist(label="tier" v-model="weaponTier" :cols="4" :options="tierOptions")
        InputChecklist(label="trait" v-model="weaponTrait" :cols="2" :options="traitOptions")
        InputChecklist(label="range" v-model="weaponRange" :cols="2" :options="rangeOptions")
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
  import GENERAL from '~/data/general';

  import { createSelectOptions } from '~/helpers/array';
  import { waitUntil } from '~/helpers/utility';

  const userStore = useUserStore();
  const weaponsStore = useWeaponsStore();

  const tierOptions = createSelectOptions([1, 2, 3, 4]);
  const traitOptions = createSelectOptions(GENERAL.traits);
  const rangeOptions = createSelectOptions(GENERAL.range);

  const search = ref('');
  const weaponTier = ref([]);
  const weaponTrait = ref([]);
  const weaponRange = ref([]);
  const filters = ref(null);

  const filteredWeapons = computed(() => {
    return weaponsStore.publicWeapons.filter((item) => {
      const matchesTier = weaponTier.value.length < 1 || weaponTier.value.includes(item.tier);
      const matchesTrait = weaponTrait.value.length < 1 || weaponTrait.value.includes(item.trait);
      const matchesRange = weaponRange.value.length < 1 || weaponRange.value.includes(item.range);

      return matchesTier &&
        matchesTrait &&
        matchesRange;
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

  const addBookmark = (id) => {
    userStore.addHomebrew('weapons', id);
    weaponsStore.bookmarkAdded(id);
  };

  const removeBookmark = (id) => {
    userStore.removeHomebrew('weapons', id);
    weaponsStore.bookmarkRemoved(id);
  };

  const resetFilters = () => {
    weaponTier.value = [];
    weaponTrait.value = [];
    weaponRange.value = [];
    filters.value.close();
  };
</script>
