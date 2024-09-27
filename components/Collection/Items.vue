<template lang="pug">
  .py-8
    .space-y-4
      .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
        HomebrewCardItem.cursor-pointer(
          v-for="item in itemsStore.homebrew"
          :item="item"
          @click="editItem(item)"
        )
      .flex.justify-end
        BasicButton(size="sm" priority="secondary" @click="newItem") New Item
    HomebrewDrawerItem(ref="itemDrawer" @save="saveItem")
</template>

<script>
  export default {
    name: 'CollectionItems',
  };
</script>

<script setup>
  const itemsStore = useItemsStore();
  const toastStore = useToastStore();

  const itemDrawer = ref(null);

  const newItem = () => {
    itemDrawer.value.open();
  };

  const saveItem = (item) => {
    const id = itemsStore.saveItem(item);

    if (id) toastStore.postMessage({ body: `Created new item: ${item.name}` });
  };

  const editItem = (item) => {
    itemDrawer.value.open(item);
  };
</script>
