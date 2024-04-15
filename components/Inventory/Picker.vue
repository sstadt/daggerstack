<template lang="pug">
  .item-picker
    button.w-full.text-left.p-4(
      v-for="(item, index) in itemList"
      class="focus:bg-slate-100"
      :class="{ 'border-b': index + 1 < itemList.length }"
      @click="$emit('select', item)"
    )
      InventoryWeapon(v-if="item.type === weaponType" :weapon="item")
      InventoryArmor(v-else-if="item.type === armorType" :armor="item")
</template>

<script>
  import WEAPONS from '~/data/weapons';
  import ARMOR from '~/data/armor';

  import {
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
            PRIMARY_WEAPON_TYPE,
            SECONDARY_WEAPON_TYPE,
            ARMOR_TYPE,
          ].includes(val);
        },
      },
    },
    data() {
      return {
        weaponType: 'weapon',
        armorType: 'armor',
      };
    },
    computed: {
      itemList() {
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
