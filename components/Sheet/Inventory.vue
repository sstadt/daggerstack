<template lang="pug">
  BasicCard(title="inventory")
    InputTextarea.pb-8.border-b.mb-8.mt-6(label="Items" v-model="items")
    InventoryWeapon(
      v-if="character.inventory.weapon.name"
      :weapon="character.inventory.weapon"
      @click="openPicker"
    )
    BasicButton.mx-auto.block(v-else @click="openPicker") Select Weapon
    BasicDrawer(ref="equipmentPicker" title="Weapons")
      InventoryPicker(
        :type="type"
        :character="character"
        :active-slot="slot"
        @select="selectWeapon"
        @remove-equipped-item="removeEquippedWeapon"
      )
</template>

<script>
  import { newWeapon } from '~/helpers/character';
  import { debounce } from '~/helpers/utility';

  import { useCharactersStore } from '~/stores/characters';

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
        type: ALL_WEAPON_TYPE,
        slot: SLOT_INVENTORY_WEAPON,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    methods: {
      openPicker() {
        this.$refs.equipmentPicker.open();
      },
      selectWeapon({ item }) {
        this.character.inventory.weapon = { ...item };
        this.charactersStore.saveCharacter(this.character);
        this.$refs.equipmentPicker.close();
      },
      removeEquippedWeapon() {
        this.character.inventory.weapon = newWeapon();
        this.charactersStore.saveCharacter(this.character);
        this.$refs.equipmentPicker.close();
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
