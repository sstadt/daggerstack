<template lang="pug">
  .item-picker.px-8.pb-8
    button.w-full(v-for="item in itemList" @click="addItem(item)")
      InventoryItem(:base-item="item")
</template>

<script>
  import ITEMS from '~/data/items';
  import { newItem } from '~/helpers/character';

  export default {
    name: 'InventoryItemPicker',
    data() {
      return {
        itemList: [ ...ITEMS.items ],
      };
    },
    methods: {
      addItem(item) {
        this.$emit('select', newItem({ name: item.name }));
      },
    },
  };
</script>
