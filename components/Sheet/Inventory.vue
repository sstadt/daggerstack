<template lang="pug">
  BasicCard(title="inventory")
    .divide-y
      InventoryItem(v-for="item in items" :character-item="item")
    div(v-for="n in maxInventoryWeapons")
      h3.text-xl.font-black.uppercase.mt-6 Inventory Weapon {{ n }}
      InventoryWeapon(
        v-if="inventoryWeapons[n - 1]"
        :weapon="inventoryWeapons[n - 1]"
        @click="openPicker(n - 1)"
      )
      BasicButton.mx-auto.my-4.block(
        v-else
        priority="secondary"
        @click="openPicker(n - 1)"
      ) Select Weapon
    BasicDrawer(ref="equipmentPicker" title="Weapons")
      InventoryEquipmentPicker(
        :type="type"
        :character="character"
        :active-slot="slot"
        :active-index="activeSlot"
        @select="selectWeapon"
        @remove-equipped-item="removeEquippedWeapon"
      )
</template>

<script>
  import GENERAL from '~/data/general';
  import WEAPONS from '~/data/weapons';

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
        activeSlot: 0,
        maxInventoryWeapons: GENERAL.maxInventoryWeapons,
        items: this.character.inventory.items,
        type: ALL_WEAPON_TYPE,
        slot: SLOT_INVENTORY_WEAPON,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      inventoryWeapons() {
        const weapons = this.character.inventory.weapons
          .map((w) => WEAPONS.items.find((weapon) => weapon.name === w.name));

        return weapons;
      },
    },
    methods: {
      openPicker(activeSlot) {
        this.activeSlot = activeSlot;
        this.$refs.equipmentPicker.open();
      },
      selectWeapon({ item }) {
        if (this.character.inventory.weapons[this.activeSlot]) {
          this.character.inventory.weapons.splice(this.activeSlot, 1, newWeapon({ name: item }));
        } else {
          this.character.inventory.weapons.push(newWeapon({ name: item }));
        }

        this.charactersStore.saveCharacter(this.character);
        this.$refs.equipmentPicker.close();
      },
      removeEquippedWeapon() {
        this.character.inventory.weapons.splice(this.activeSlot, 1, newWeapon());
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
