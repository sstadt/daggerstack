<template lang="pug">
  .py-8
    .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
      TransitionGroup(name="slide-fade-left")
        .relative(
          v-for="item in itemsStore.homebrew"
          :key="item.id"
        )
          NuxtIcon.absolute.top-0.right-14.text-red-900.text-xl(
            v-if="bookmarks.includes(item.id)"
            name="bookmark"
          )
          CardItem.cursor-pointer.h-full(:item="item" @click="editItem(item)")
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
    name: 'HomebrewCollectionItems',
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
