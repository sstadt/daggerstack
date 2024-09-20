<template lang="pug">
  .py-8
    .flex.justify-end
      BasicButton(size="sm" priority="secondary" @click="newItem") Create Item
    p todo: output homebrew items here
    HomebrewDrawerItem(ref="itemDrawer" @save="saveItem")
</template>

<script>
  export default {
    name: 'CollectionItems',
  };
</script>

<script setup>
  const itemDrawer = ref(null);

  const newItem = () => {
    itemDrawer.value.open();
  };

  const saveItem = (item) => {
    console.log(item);
  };
</script>
