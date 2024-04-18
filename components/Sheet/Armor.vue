<template lang="pug">
  BasicCard(title="Active Armor")
    .mt-6
      InventoryArmor(
        v-if="character.equipment.armor.name"
        :armor="character.equipment.armor"
        @click="openPicker"
      )
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';

  import { OPEN_EQUIPMENT_PICKER } from '~/config/events';
  import {
    ARMOR_TYPE,
    SLOT_ARMOR,
  } from '~/config/equipmentPicker';

  export default {
    name: 'SheetArmor',
    props: {
      character: {
        type: Object,
        requried: true,
      },
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    methods: {
      openPicker() {
        this.$emit(OPEN_EQUIPMENT_PICKER, {
          type: ARMOR_TYPE,
          slot: SLOT_ARMOR,
        });
      },
      selectItem(armor) {
        this.character.equipment.armor = { ...armor };
        this.charactersStore.saveCharacter(this.character);
      },
    },
  };
</script>
