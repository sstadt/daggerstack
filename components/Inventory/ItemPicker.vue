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
      button.px-4.w-full(
        v-for="item in itemList"
        :disabled="item.relic && hasRelic"
        :class="{ 'opacity-50': item.relic && hasRelic }"
        @click="addItem(item)"
      )
        InventoryItem(:character="character" :base-item="item")
</template>

<script>
  export default {
    name: 'InventoryItemPicker',
  };
</script>

<script setup>
  import { newItem } from '~/helpers/constructors';
  import { uuidv4 } from '~/helpers/utility';

  const itemsStore = useItemsStore();

  const emit = defineEmits(['select']);

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const key = ref(uuidv4())
  const customName = ref('');
  const customNotes = ref('');

  const relicList = computed(() => {
    return itemsStore.items
      .filter((item) => item.relic === true)
      .map((item) => item.id);
  });

  const hasRelic = computed(() => {
    return props.character.inventory.items
      .find((item) => relicList.value.includes(item.itemId));
  });

  const addItem = (item) => {
    emit('select', newItem({
      itemId: item.id,
      name: item.name,
      modify: item.modify ? { ...item.modify } : {},
    }));
  };

  const addCustomItem = () => {
    emit('select', newItem({
      name: customName.value,
      notes: customNotes.value,
      custom: true,
    }));
  };
</script>
