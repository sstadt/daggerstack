<template lang="pug">
  .p-8
    p todo: output homebrew items here
    .flex.justify-end
      BasicButton(size="sm" priority="secondary" @click="newItem") Create Item
    HomebrewDrawerItem(ref="itemDrawer")
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
</script>
