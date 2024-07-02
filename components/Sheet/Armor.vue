<template lang="pug">
  BasicCard(title="Active Armor")
    .mt-6
      InventoryArmor(
        v-if="armor"
        :armor="armor"
        @click="openPicker"
      )
      BasicButton.mx-auto.block(v-else @click="openPicker")
        | Select Armor
      BasicDrawer(ref="equipmentPicker" title="Weapons")
        InventoryEquipmentPicker(
          :type="type"
          :character="character"
          :active-slot="slot"
          @select="selectItem"
          @remove-equipped-item="removeEquippedArmor"
        )
</template>

<script>
  import ARMOR from '~/data/armor';

  import { useCharactersStore } from '~/stores/characters';
  import { newArmor } from '~/helpers/character';

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
    data() {
      return {
        slot: SLOT_ARMOR,
        type: ARMOR_TYPE,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      armor() {
        return this.character.equipment.armor.name
          ? ARMOR.items.find((armor) => this.character.equipment.armor.name === armor.name)
          : null;
      },
    },
    methods: {
      openPicker() {
        this.$refs.equipmentPicker.open();
      },
      selectItem({ item }) {
        this.character.equipment.armor = newArmor({ name: item });
        this.charactersStore.saveCharacter(this.character);
        this.$refs.equipmentPicker.close();
      },
      removeEquippedArmor() {
        this.character.equipment.armor = newArmor();
        this.charactersStore.saveCharacter(this.character);
        this.$refs.equipmentPicker.close();
      },
    },
  };
</script>
