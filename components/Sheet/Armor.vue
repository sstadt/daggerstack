<template lang="pug">
  BasicCard(title="Armor")
    .mt-6
      transition(name="fade" mode="out-in")
        InventoryArmor.cursor-pointer(
          v-if="armor"
          :armor="armor"
          :character-armor="character.inventory.armor"
          :character="character"
          @update="(updates) => updateItem(updates, index)"
          @remove="removeItem(index)"
        )
        .flex.justify-end(v-else)
          BasicButton(size="sm" priority="secondary" @click="openPicker") Add Armor
    BasicDrawer(ref="equipmentPicker" title="Armor")
      InventoryEquipmentPicker(type="armor" :character="character" @select="selectItem")
</template>

<script>
  export default {
    name: 'SheetArmor',
  };
</script>

<script setup>
  import { newArmor } from '~/helpers/constructors';

  const charactersStore = useCharactersStore();
  const armorStore = useArmorStore();

  const props = defineProps({
    character: {
      type: Object,
      requried: true,
    },
  });

  const equipmentPicker = ref(null);

  const armor = computed(() => {
    return armorStore.armor(props.character.inventory?.armor?.itemId);
  });

  const openPicker = () => {
    equipmentPicker.value.open();
  };

  const selectItem = (item) => {
    props.character.inventory.armor = newArmor({ name: item.name, itemId: item.id });
    charactersStore.saveCharacter(props.character);
    equipmentPicker.value.close();
  };

  const updateItem = (updates, index) => {
    const existingArmor = { ...props.character.inventory.armor };
    const updatedArmor = Object.assign(existingArmor, updates);

    props.character.inventory.armor = { ...updatedArmor };
    charactersStore.saveCharacter(props.character);
  };

  const removeItem = () => {
    props.character.inventory.armor = newArmor();
    charactersStore.saveCharacter(props.character);
    equipmentPicker.value.close();
  };
</script>
