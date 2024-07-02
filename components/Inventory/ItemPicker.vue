<template lang="pug">
  .item-picker
</template>

<script>
  import ITEMS from '~/data/items';

  export default {
    name: 'InventoryItemPicker',
    data() {
      return {
        itemList: [ ...ITEMS.items ],
      };
    },
  };
</script>
