<template lang="pug">
  BasicCard(title="items")
    .space-y-8
      .flex.flex-col.space-y-2.items-end
        TransitionGroup.w-full.divide-y(name="slide-fade-left" tag="div")
          InventoryItem(
            v-for="(item, index) in character.inventory.items"
            :key="item.id"
            :character-item="item"
            :character="character"
            @update="(updatedItem) => updateItem(updatedItem, index)"
            @remove="removeItem(index)"
          )
        BasicButton(size="sm" priority="secondary" @click="openItemPicker") Add Item
    BasicDrawer(ref="itemPicker" title="Items")
      InventoryItemPicker(:character="character" @select="addItem")
</template>

<script>
  export default {
    name: 'SheetInventory',
  };
</script>

<script setup>
  const charactersStore = useCharactersStore();

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const itemPicker = ref(null);

  const openItemPicker = () => {
    itemPicker.value.open();
  };

  const addItem = (item) => {
    itemPicker.value.close();
    props.character.inventory.items.push({ ...item });
    charactersStore.saveCharacter(props.character);
  };

  const updateItem = (updatedItem, index) => {
    const item = Object.assign({}, props.character.inventory.items[index], updatedItem);
    props.character.inventory.items.splice(index, 1, item);
    charactersStore.saveCharacter(props.character);
  };

  const removeItem = (index) => {
    props.character.inventory.items.splice(index, 1);
    charactersStore.saveCharacter(props.character);
  };
</script>
