<template lang="pug">
  BasicCard(title="inventory")
    InputTextarea.pb-8.border-b.mb-8.mt-6(label="Items" v-model="items")
    InventoryWeapon(
      v-if="character.inventory.weapon.name"
      :weapon="character.inventory.weapon"
      @click="openPicker"
    )
    BasicButton.mx-auto.block(v-else @click="openPicker") Select Weapon
</template>

<script>
  import { debounce } from '~/helpers/utility';

  import { useCharactersStore } from '~/stores/characters';

  import { OPEN_EQUIPMENT_PICKER } from '~/config/events';
  import {
    ALL_WEAPON_TYPE,
    SLOT_INVENTORY_WEAPON,
  } from '~/config/equipmentPicker';

  export default {
    name: 'SheetInventory',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        items: this.character.inventory.items,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    methods: {
      openPicker() {
        this.$emit(OPEN_EQUIPMENT_PICKER, {
          type: ALL_WEAPON_TYPE,
          slot: SLOT_INVENTORY_WEAPON,
        });
      },
      selectItem(weapon) {
        this.character.inventory.weapon = { ...weapon };
        this.charactersStore.saveCharacter(this.character);
      },
      saveItems: debounce(function () {
        this.character.inventory.items = this.items;
        this.charactersStore.saveCharacter(this.character);
      }, 500),
    },
    watch: {
      items(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.saveItems();
        }
      },
    },
  };
</script>
