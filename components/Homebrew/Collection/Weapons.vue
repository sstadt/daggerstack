<template lang="pug">
  .py-8
    .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
      TransitionGroup(name="slide-fade-left")
        .relative(
          v-for="weapon in weaponsStore.homebrew"
          :key="weapon.id"
        )
          NuxtIcon.absolute.top-0.right-14.text-red-900.text-xl(
            v-if="bookmarks.includes(weapon.id)"
            name="bookmark"
          )
          HomebrewCardWeapon.cursor-pointer.h-full(
            :weapon="weapon"
            @click="editWeapon(weapon)"
          )
    BasicButton.fixed.bottom-20.right-6.shadow(
      size="sm"
      priority="secondary"
      icon
      @click="newItem"
    )
      NuxtIcon(name="plus")
      span.sr-only New Item
    HomebrewDrawerWeapon(ref="drawer" @save="saveWeapon" @delete="deleteWeapon")
</template>

<script>
  export default {
    name: 'HomebrewCollectionWeapons',
  };
</script>

<script setup>
  const userStore = useUserStore();
  const weaponsStore = useWeaponsStore();
  const toastStore = useToastStore();

  const drawer = ref(null);

  const bookmarks = computed(() => {
    return userStore.profile?.weapons || [];
  });

  const newItem = () => {
    drawer.value.open();
  };

  const editWeapon = (weapon) => {
    if (!bookmarks.value.includes(weapon.id)) drawer.value.open(weapon);
  };

  const saveWeapon = (weapon) => {
    weaponsStore.saveWeapon(weapon);
  };

  const deleteWeapon = async (id) => {
    weaponsStore.deleteWeapon(id);
  };
</script>
