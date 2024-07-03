<template lang="pug">
  .item-picker
    form.pt-4.px-4.space-y-2.flex.flex-col.items-end(@submit.prevent="addCustomItem")
      h3.text-xl.font-black.uppercase.w-full Custom Item
      InputText.w-full(:key="`${key}-name`" label="name" v-model="customName")
      InputTextarea.w-full(:key="`${key}-notes`" label="notes" v-model="customNotes")
      BasicButton(type="submit" size="sm") Add
    .p-4.sticky.top-0.bg-white.shadow
      h3.text-xl.font-black.uppercase All Items
      //- todo: filtering
    .divide-y
      button.px-4.w-full(v-for="item in itemList" @click="addItem(item)")
        InventoryItem(:base-item="item")
</template>

<script>
  import ITEMS from '~/data/items';
  import { newItem } from '~/helpers/character';
  import { uuidv4 } from '~/helpers/utility';

  export default {
    name: 'InventoryItemPicker',
    data() {
      return {
        key: uuidv4(),
        itemList: [ ...ITEMS.items ],
        customName: '',
        customNotes: '',
      };
    },
    methods: {
      addItem(item) {
        this.$emit('select', newItem({ name: item.name }));
      },
      addCustomItem() {
        this.$emit('select', newItem({
          name: this.customName,
          notes: this.customNotes,
          custom: true,
        }));
      },
    },
  };
</script>
