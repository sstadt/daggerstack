<template lang="pug">
  .item-picker
    form.p-4.space-y-2.flex.flex-col.items-end.border-b(@submit.prevent="addCustomItem")
      h3.text-xl.font-black.uppercase.w-full Add Custom Item
      InputText.w-full(:key="`${key}-name`" label="name" v-model="customName")
      InputTextarea.w-full(:key="`${key}-notes`" label="notes" v-model="customNotes")
      BasicButton(type="submit" size="sm") Add
    .p-4.space-y-2.sticky.top-0.bg-white.shadow
      .flex.justify-between.items-center
        h3.text-xl.font-black.uppercase Add Item
        InputToggle(label="Filter" v-model="showFilters")
      transition(name="slide-fade-right")
        .space-y-2(v-if="showFilters")
          InputSelect(label="item type" v-model="itemType" :options="itemTypeOptions" required)
          InputText(label="search" v-model="itemSearch")
    transition-group.divide-y(name="slide-fade-left" tag="div")
      button.px-4.w-full(
        v-for="item in filteredItems"
        :key="item.id"
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
  import { getItemType } from '~/helpers/item';

  const itemsStore = useItemsStore();

  const emit = defineEmits(['select']);

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const itemTypeOptions = [
    { label: 'All Items', value: 'all' },
    { label: 'Basic Items', value: 'basic' },
    { label: 'Attachments', value: 'attachment' },
    { label: 'Consumables', value: 'consumable' },
    { label: 'Recipes', value: 'recipe' },
    { label: 'Relics', value: 'relic' },
    { label: 'Downtime Items', value: 'downtime' },
  ];

  const key = ref(uuidv4())
  const customName = ref('');
  const customNotes = ref('');
  const showFilters = ref(false);
  const itemType = ref('all');
  const itemSearch = ref('');

  const itemList = computed(() => {
    return itemsStore.items.filter((item) => {
      return itemType.value === 'all'
        ? true
        : getItemType(item) === itemType.value;
    });
  });

  const filteredItems = computed(() => {
    return itemSearch.value.length < 0
      ? itemList.value
      : itemList.value.filter((item) => {
          return item.name.toLowerCase().includes(itemSearch.value.toLowerCase())
        });
  });

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
