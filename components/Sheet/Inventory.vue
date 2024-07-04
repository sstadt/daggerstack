<template lang="pug">
  BasicCard(title="inventory")
    .space-y-8
      .flex.flex-col.space-y-2.items-end
        TransitionGroup.w-full.divide-y(name="slide-fade-left" tag="div")
          InventoryItem(
            v-for="(item, index) in items"
            :key="item.id"
            :character-item="item"
            :character="character"
            @update="(updatedItem) => updateItem(updatedItem, index)"
            @remove="removeItem(index)"
          )
        BasicButton(size="sm" priority="secondary" @click="openItemPicker") Add Item
      div(v-for="n in maxInventoryWeapons")
        h3.text-xl.font-black.uppercase.mt-6 Inventory Weapon {{ n }}
        InventoryWeapon(
          v-if="inventoryWeapons[n - 1]"
          :weapon="inventoryWeapons[n - 1]"
          :character-weapon="character.inventory.weapons[n - 1]"
          :character="character"
          @click="openEquipmentPicker(n - 1)"
        )
        BasicButton.mx-auto.my-4.block(
          v-else
          priority="secondary"
          @click="openEquipmentPicker(n - 1)"
        ) Select Weapon
    BasicDrawer(ref="itemPicker" title="Items")
      InventoryItemPicker(:character="character" @select="addItem")
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
      openEquipmentPicker(activeSlot) {
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
      openItemPicker() {
        this.$refs.itemPicker.open();
      },
      addItem(item) {
        this.$refs.itemPicker.close();
        this.character.inventory.items.push({ ...item });
        this.charactersStore.saveCharacter(this.character);
      },
      updateItem(updatedItem, index) {
        const item = Object.assign({}, this.character.inventory.items[index], updatedItem);
        this.character.inventory.items.splice(index, 1, item);
        this.charactersStore.saveCharacter(this.character);
      },
      removeItem(index) {
        this.character.inventory.items.splice(index, 1);
        this.charactersStore.saveCharacter(this.character);
      },
    },
  };
</script>
