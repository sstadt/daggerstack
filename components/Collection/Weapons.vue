<template lang="pug">
  .py-8
    .space-y-4
      .relative(
        v-for="item in weaponsStore.homebrew"
        :key="item.id"
      )
        NuxtIcon.absolute.top-0.right-14.text-red-900.text-xl(
          v-if="bookmarks.includes(item.id)"
          name="bookmark"
        )
        HomebrewCardItem.cursor-pointer(:item="item" @click="editWeapon(item)")
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
    name: 'CollectionWeapons',
  };
</script>

<script setup>
  const userStore = useUserStore();
  const weaponsStore = useWeaponsStore();
  const toastStore = useToastStore();

  const drawer = ref(null);

  const bookmarks = computed(() => {
    return userStore.profile?.items || [];
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
