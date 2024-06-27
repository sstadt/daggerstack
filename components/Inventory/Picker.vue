<template lang="pug">
  .item-picker
    .p-4(v-if="equippedItem")
      .flex.justify-between.items-center.mb-4
        h3.text-xl.font-black.uppercase Currently Equipped
        BasicButton.ml-auto(size="sm" @click="removeItem") Remove
      InventoryWeapon(
        v-if="equippedItem.type === weaponType"
        :weapon="equippedItem"
        :type="type"
      )
      InventoryArmor(
        v-else-if="equippedItem.type === armorType"
        :armor="equippedItem"
      )
    div(v-if="isWeaponType && includeInventory && inventoryWeapon")
      h3.text-xl.font-black.uppercase.p-4 From Inventory
      button.w-full.text-left.p-4(
        class="focus:bg-slate-100"
        :class="{ 'border-b': index + 1 < itemList.length }"
        @click="$emit('select', { item: inventoryWeapon, fromInventory: true })"
      )
        InventoryWeapon(:weapon="inventoryWeapon" :type="type")
    h3.text-xl.font-black.uppercase.p-4 Available Items
    button.w-full.text-left.p-4(
      v-for="(item, index) in itemList"
      class="focus:bg-slate-100"
      :class="{ 'border-b': index + 1 < itemList.length }"
      @click="$emit('select', { item: { ...item } })"
    )
      InventoryWeapon(v-if="item.type === weaponType" :weapon="item" :type="type")
      InventoryArmor(v-else-if="item.type === armorType" :armor="item")
</template>

<script>
  import WEAPONS from '~/data/weapons';
  import ARMOR from '~/data/armor';

  import { respectBurden } from '~/helpers/character';
  import { REMOVE_EQUIPPED_ITEM } from '~/config/events';
  import {
    ALL_WEAPON_TYPE,
    PRIMARY_WEAPON_TYPE,
    SECONDARY_WEAPON_TYPE,
    ARMOR_TYPE,
    SLOT_INVENTORY_WEAPON,
    SLOT_PRIMARY_WEAPON,
    SLOT_SECONDARY_WEAPON,
    SLOT_ARMOR,
  } from '~/config/equipmentPicker';

  export default {
    name: 'InventoryPicker',
    props: {
      type: {
        type: String,
        validator(val) {
          return [
            ALL_WEAPON_TYPE,
            PRIMARY_WEAPON_TYPE,
            SECONDARY_WEAPON_TYPE,
            ARMOR_TYPE,
          ].includes(val);
        },
      },
      activeSlot: {
        type: String,
        default: null,
        validator(val) {
          return [
            null,
            SLOT_INVENTORY_WEAPON,
            SLOT_PRIMARY_WEAPON,
            SLOT_SECONDARY_WEAPON,
            SLOT_ARMOR,
          ].includes(val);
        },
      },
      includeInventory: {
        type: Boolean,
        default: false,
      },
      character: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        weaponType: 'weapon',
        armorType: 'armor',
      };
    },
    computed: {
      equippedItem() {
        if (!this.activeSlot || !this.character) return null;

        switch (this.activeSlot) {
          case SLOT_INVENTORY_WEAPON:
            return this.character.inventory.weapon.name
              ? { ...this.character.inventory.weapon }
              : null;
          case SLOT_PRIMARY_WEAPON:
            return this.character.equipment.primaryWeapon.name
              ? { ...this.character.equipment.primaryWeapon }
              : null;
          case SLOT_SECONDARY_WEAPON:
            return this.character.equipment.secondaryWeapon.name
              ? { ...this.character.equipment.secondaryWeapon }
              : null;
          case SLOT_ARMOR:
            return this.character.equipment.armor.name
              ? { ...this.character.equipment.armor }
              : null;
        }

        return null;
      },
      isWeaponType() {
        return [
          ALL_WEAPON_TYPE,
          PRIMARY_WEAPON_TYPE,
          SECONDARY_WEAPON_TYPE,
        ].includes(this.type);
      },
      inventoryWeapon() {
        return this.character && this.character.inventory.weapon.name
          ? this.character.inventory.weapon
          : null;
      },
      itemList() {
        if (this.type === ALL_WEAPON_TYPE) {
          return [ ...WEAPONS.items ];
        }

        if (this.type === PRIMARY_WEAPON_TYPE) {
          return WEAPONS.items.filter((item) => item.primary === true);
        }

        if (this.type === SECONDARY_WEAPON_TYPE) {
          return this.respectBurden
            ? WEAPONS.items.filter((item) => item.secondary === true)
            : WEAPONS.items.filter((item) => {
                return item.secondary === true || item.primary === true && item.burden > 1;
              });
        }

        if (this.type === ARMOR_TYPE) {
          return [ ...ARMOR.items ];
        }

        return [];
      },
      respectBurden() {
        return respectBurden(this.character);
      },
    },
    methods: {
      removeItem() {
        this.$emit(REMOVE_EQUIPPED_ITEM);
      },
    },
  };
</script>
