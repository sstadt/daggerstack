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
    div(v-if="isWeaponType && includeInventory && inventoryWeapons.length > 0")
      h3.text-xl.font-black.uppercase.p-4 From Inventory
      button.w-full.text-left.p-4(
        v-for="weapon in inventoryWeapons"
        class="focus:bg-slate-100"
        :class="{ 'border-b': index + 1 < itemList.length }"
        @click="$emit('select', { item: weapon, fromInventory: true })"
      )
        InventoryWeapon(:weapon="weapon" :type="type")
    .sticky.p-4.top-0.bg-white.shadow.space-y-1
      h3.text-xl.font-black.uppercase Available Items
      .flex.justify-between
        InputFilter(
          v-model="selectedTiers"
          label="tiers"
          :options="[0, 1, 2, 3]"
        )
        InputFilter(
          v-if="type === allWeaponsType"
          v-model="selectedType"
          label="slot"
          hide-label
          :options="['primary', 'secondary']"
        )
    button.w-full.text-left.p-4(
      v-for="(item, index) in sortedItems"
      class="focus:bg-slate-100"
      :class="{ 'border-b': index + 1 < itemList.length }"
      @click="$emit('select', { item: item.name })"
    )
      InventoryWeapon(v-if="isWeaponType" :weapon="item" :type="type")
      InventoryArmor(v-else :armor="item")
</template>

<script>
  import GENERAL from '~/data/general';
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
        required: true,
      },
      startingOnly: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      const selectedTiers = [];

      if (this.character.level > 1) {
        selectedTiers.push(1);
      } else if (this.character.level > 4) {
        selectedTiers.push(2);
      } if (this.character.level > 7) {
        selectedTiers.push(3);
      } else {
        selectedTiers.push(0);
      }

      return {
        selectedTiers,
        selectedType: ['primary'],
        weaponType: 'weapon',
        armorType: 'armor',
        allWeaponsType: ALL_WEAPON_TYPE,
      };
    },
    computed: {
      bestStatistic() {
        let best = '';
        let score = -10;

        GENERAL.traits.forEach((trait) => {
          if (this.character[trait].score > score) {
            best = trait;
            score = score;
          }
        });

        return best;
      },
      isCaster() {
        return GENERAL.spellcasters.includes(this.character.baseClass);
      },
      equippedItem() {
        if (!this.activeSlot || !this.character) return null;

        // TODO: this will break as soon as it's accessed because of the change in structure
        // switch (this.activeSlot) {
        //   case SLOT_INVENTORY_WEAPON:
        //     return this.character.inventory.weapon.name
        //       ? { ...this.character.inventory.weapon }
        //       : null;
        //   case SLOT_PRIMARY_WEAPON:
        //     return this.character.equipment.primaryWeapon.name
        //       ? { ...this.character.equipment.primaryWeapon }
        //       : null;
        //   case SLOT_SECONDARY_WEAPON:
        //     return this.character.equipment.secondaryWeapon.name
        //       ? { ...this.character.equipment.secondaryWeapon }
        //       : null;
        //   case SLOT_ARMOR:
        //     return this.character.equipment.armor.name
        //       ? { ...this.character.equipment.armor }
        //       : null;
        // }

        return null;
      },
      isWeaponType() {
        return [
          ALL_WEAPON_TYPE,
          PRIMARY_WEAPON_TYPE,
          SECONDARY_WEAPON_TYPE,
        ].includes(this.type);
      },
      inventoryWeapons() {
        return this.character.inventory.weapons
          .map((w) => WEAPONS.find((weapon) => weapon.name === w.name))
          .filter((w) => w.slot === this.type);
      },
      itemList() {
        if (this.type === ALL_WEAPON_TYPE) {
          return [ ...WEAPONS.items ];
        }

        if (this.type === PRIMARY_WEAPON_TYPE) {
          return WEAPONS.items.filter((item) => item.slot === 'primary');
        }

        if (this.type === SECONDARY_WEAPON_TYPE) {
          return WEAPONS.items.filter((item) => item.slot === 'secondary');
        }

        if (this.type === ARMOR_TYPE) {
          return [ ...ARMOR.items ];
        }

        return [];
      },
      showingAllWeapons() {
        return this.type === this.allWeaponsType;
      },
      sortedItems() {
        const tiers = this.startingOnly ? [0] : this.selectedTiers;

        return this.itemList
          .filter((item) => {
            const matchesTierFilter = tiers.includes(item.tier);
            // TODO: make a "show unavailable" toggle to bypass this
            const matchesMagicFilter = item.damageType !== 'magical' || this.isCaster;
            const matchesTypeFilter = !this.showingAllWeapons || this.selectedType.includes(item.slot);

            return matchesTierFilter &&
              matchesMagicFilter &&
              matchesTypeFilter;
          })
          .sort((a, b) => {
            if (a.trait === this.bestStatistic && b.trait !== this.bestStatistic) {
              return 1;
            }

            if (a.trait !== this.bestStatistic && b.trait === this.bestStatistic) {
              return -1;
            }

            return 0;
          });
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
