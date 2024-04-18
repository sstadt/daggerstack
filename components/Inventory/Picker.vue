<template lang="pug">
  .item-picker
    div(v-if="isWeaponType && includeInventory && inventoryWeapon")
      h3.text-xl.font-black.uppercase.p-4 From Inventory
      button.w-full.text-left.p-4(
        class="focus:bg-slate-100"
        :class="{ 'border-b': index + 1 < itemList.length }"
        @click="$emit('select', { item: inventoryWeapon, fromInventory: true })"
      )
        InventoryWeapon(:weapon="inventoryWeapon")
      h3.text-xl.font-black.uppercase.p-4 Other Weapons
    button.w-full.text-left.p-4(
      v-for="(item, index) in itemList"
      class="focus:bg-slate-100"
      :class="{ 'border-b': index + 1 < itemList.length }"
      @click="$emit('select', { item: { ...item } })"
    )
      InventoryWeapon(v-if="item.type === weaponType" :weapon="item")
      InventoryArmor(v-else-if="item.type === armorType" :armor="item")
</template>

<script>
  import WEAPONS from '~/data/weapons';
  import ARMOR from '~/data/armor';

  import {
    ALL_WEAPON_TYPE,
    PRIMARY_WEAPON_TYPE,
    SECONDARY_WEAPON_TYPE,
    ARMOR_TYPE,
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
          return [ ...WEAPONS.items.filter((item) => item.primary === true) ];
        }

        if (this.type === SECONDARY_WEAPON_TYPE) {
          return [ ...WEAPONS.items.filter((item) => item.secondary === true) ];
        }

        if (this.type === ARMOR_TYPE) {
          return [ ...ARMOR.items ];
        }

        return [];
      },
    },
  };
</script>
