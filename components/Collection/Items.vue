<template lang="pug">
  .py-8
    .space-y-4
      .relative(
        v-for="item in itemsStore.homebrew"
        :key="item.id"
      )
        NuxtIcon.absolute.top-0.right-14.text-red-900.text-xl(
          v-if="bookmarks.includes(item.id)"
          name="bookmark"
        )
        HomebrewCardItem.cursor-pointer(:item="item" @click="editItem(item)")
    BasicButton.fixed.bottom-20.right-6.shadow(
      size="sm"
      priority="secondary"
      icon
      @click="newItem"
    )
      NuxtIcon(name="plus")
      span.sr-only New Item
    HomebrewDrawerItem(ref="itemDrawer" @save="saveItem" @delete="deleteItem")
</template>

<script>
  export default {
    name: 'CollectionItems',
  };
</script>

<script setup>
  const userStore = useUserStore();
  const itemsStore = useItemsStore();
  const toastStore = useToastStore();

  const itemDrawer = ref(null);

  const bookmarks = computed(() => {
    return userStore.profile?.items || [];
  });

  const newItem = () => {
    itemDrawer.value.open();
  };

  const editItem = (item) => {
    if (!bookmarks.value.includes(item.id)) itemDrawer.value.open(item);
  };

  const saveItem = (item) => {
    itemsStore.saveItem(item);
  };

  const deleteItem = async (id) => {
    itemsStore.deleteItem(id);
  };
</script>
