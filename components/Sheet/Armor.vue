<template lang="pug">
  BasicCard(title="Armor")
    .mt-6
      InventoryArmor.cursor-pointer(
        v-if="armor"
        :armor="armor"
        :character-armor="character.inventory.armor"
        :character="character"
        @click="openPicker"
      )
      BasicButton.mx-auto.block(
        v-else
        priority="secondary"
        @click="openPicker"
      ) Select Armor
      BasicDrawer(ref="equipmentPicker" title="Armor")
        InventoryEquipmentPicker(
          :type="type"
          :character="character"
          :active-slot="slot"
          @select="selectItem"
          @remove-equipped-item="removeEquippedArmor"
        )
</template>

<script>
  export default {
    name: 'SheetArmor',
  };
</script>

<script setup>
  import ARMOR from '~/data/armor';

  import { useCharactersStore } from '~/stores/characters';
  import { newArmor } from '~/helpers/constructors';

  import {
    ARMOR_TYPE,
    SLOT_ARMOR,
  } from '~/config/equipmentPicker';

  const charactersStore = useCharactersStore();
  const armorStore = useArmorStore();

  const props = defineProps({
    character: {
      type: Object,
      requried: true,
    },
  });

  const slot = ref(SLOT_ARMOR);
  const type = ref(ARMOR_TYPE);

  const equipmentPicker = ref(null);

  const armor = computed(() => {
    return armorStore.armor(props.character.inventory?.armor?.itemId);
  });

  const openPicker = () => {
    equipmentPicker.value.open();
  };

  const selectItem = ({ item }) => {
    props.character.inventory.armor = newArmor({ name: item, itemId: item.id });
    charactersStore.saveCharacter(props.character);
    equipmentPicker.value.close();
  };

  const removeEquippedArmor = () => {
    props.character.inventory.armor = newArmor();
    charactersStore.saveCharacter(props.character);
    equipmentPicker.value.close();
  };
</script>
