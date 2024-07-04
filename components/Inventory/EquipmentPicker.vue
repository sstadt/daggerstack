<template lang="pug">
  .equipment-picker
    .p-4(v-if="equippedItem")
      .flex.justify-between.items-center.mb-4
        h3.text-xl.font-black.uppercase Currently Equipped
        BasicButton.ml-auto(size="sm" @click="removeItem") Remove
      InventoryWeapon(
        v-if="isWeaponType"
        :weapon="equippedItem"
        :type="type"
      )
      InventoryArmor(
        v-else
        :armor="equippedItem"
      )
    div(v-if="isWeaponType && includeInventory && inventoryWeapons.length > 0")
      h3.text-xl.font-black.uppercase.p-4 From Inventory
      .divide-y
        button.w-full.text-left.p-4(
          v-for="weapon in inventoryWeapons"
          class="focus:bg-slate-100"
          @click="$emit('select', { item: weapon.name, fromInventory: true })"
        )
          InventoryWeapon(:weapon="weapon" :type="type")
    .sticky.p-4.top-0.bg-white.shadow.space-y-1
      h3.text-xl.font-black.uppercase Available Items
      .flex.space-x-6
        InputFilter(
          v-model="selectedTiers"
          label="tier"
          :options="[0, 1, 2, 3]"
        )
        InputFilter(
          v-if="type === allWeaponsType"
          v-model="selectedType"
          label="slot"
          :options="['primary', 'secondary']"
        )
    .divide-y
      button.w-full.text-left.p-4(
        v-for="item in sortedItems"
        class="focus:bg-slate-100"
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
    name: 'InventoryEquipmentPicker',
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
      activeIndex: {
        type: Number,
        default: -1,
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
        allWeaponsType: ALL_WEAPON_TYPE,
      };
    },
    computed: {
      bestStatistic() {
        const [ best ] = GENERAL.traits
          .map((trait) => ({ name: trait, score: this.character[trait].score }))
          .sort((a, b) => {
            if (a.score < b.score) return 1;
            if (b.score < a.score) return -1;
            return 0;
          });

        return best.name;
      },
      isCaster() {
        return GENERAL.spellcasters.includes(this.character.baseClass);
      },
      equippedItem() {
        if (!this.activeSlot) return null;

        switch (this.activeSlot) {
          case SLOT_INVENTORY_WEAPON:
            return this.activeIndex > -1 && this.character.inventory.weapons[this.activeIndex]
              ? WEAPONS.items.find((w) => {
                  return w.name === this.character.inventory.weapons[this.activeIndex].name;
                })
              : null;
          case SLOT_PRIMARY_WEAPON:
            return this.character.equipment.primaryWeapon.name
              ? WEAPONS.items.find((w) => w.name === this.character.equipment.primaryWeapon.name)
              : null;
          case SLOT_SECONDARY_WEAPON:
            return this.character.equipment.secondaryWeapon.name
              ? WEAPONS.items.find((w) => w.name === this.character.equipment.secondaryWeapon.name)
              : null;
          case SLOT_ARMOR:
            return this.character.equipment.armor.name
              ? ARMOR.items.find((w) => w.name === this.character.equipment.armor.name)
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
      inventoryWeapons() {
        return this.character.inventory.weapons
          .map((w) => WEAPONS.items.find((weapon) => weapon.name === w.name))
          .filter((w) => this.type.includes(w.slot));
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
            if (!a.trait || !b.trait) return 0;

            const aTrait = a.trait.toLowerCase();
            const bTrait = b.trait.toLowerCase();

            if (aTrait === this.bestStatistic && bTrait !== this.bestStatistic) {
              return -1;
            }

            if (aTrait !== this.bestStatistic && bTrait === this.bestStatistic) {
              return 1;
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
