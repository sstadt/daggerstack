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
          @click="selectItem({ item: weapon.name, fromInventory: true })"
        )
          InventoryWeapon(:weapon="weapon" :type="type")
    .sticky.p-4.top-0.bg-white.shadow.space-y-1
      h3.text-xl.font-black.uppercase Available Items
      .flex.space-x-6
        InputFilter(
          v-if="!startingOnly"
          v-model="selectedTiers"
          label="tier"
          :options="[1, 2, 3, 4]"
        )
    .divide-y
      button.w-full.text-left.p-4(
        v-for="item in sortedItems"
        class="focus:bg-slate-100"
        @click="selectItem({ item: item.name })"
      )
        InventoryWeapon(
          v-if="isWeaponType"
          :weapon="item"
          :type="type"
          :recommended-trait="bestTrait"
        )
        InventoryArmor(v-else :armor="item")
</template>

<script>
  export default {
    name: 'InventoryEquipmentPicker',
  };
</script>

<script setup>
  import GENERAL from '~/data/general';
  import WEAPONS from '~/data/weapons';
  import ARMOR from '~/data/armor';

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

  const emit = defineEmits([ REMOVE_EQUIPPED_ITEM, 'select' ]);

  const props = defineProps({
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
  });

  const selectedTiers = ref([1]);

  if (props.character.level > 4) selectedTiers.value.push(2);
  if (props.character.level > 7) selectedTiers.value.push(3);

  const selectedType = ref(['primary']);

  const bestTrait = computed(() => {
    const [ best ] = GENERAL.traits
      .map((trait) => ({ name: trait, score: props.character[trait].score }))
      .sort((a, b) => {
        if (a.score < b.score) return 1;
        if (b.score < a.score) return -1;
        return 0;
      });

    return best.name;
  });

  const isCaster = computed(() => {
    return GENERAL.spellcasters.includes(props.character.baseClass);
  });

  const equippedItem = computed(() => {
    if (!props.activeSlot) return null;

    switch (props.activeSlot) {
      case SLOT_INVENTORY_WEAPON:
        return props.activeIndex > -1 && props.character.inventory.weapons[props.activeIndex]
          ? WEAPONS.items.find((w) => {
              return w.name === props.character.inventory.weapons[props.activeIndex].name;
            })
          : null;
      case SLOT_PRIMARY_WEAPON:
        return props.character.equipment.primaryWeapon.name
          ? WEAPONS.items.find((w) => w.name === props.character.equipment.primaryWeapon.name)
          : null;
      case SLOT_SECONDARY_WEAPON:
        return props.character.equipment.secondaryWeapon.name
          ? WEAPONS.items.find((w) => w.name === props.character.equipment.secondaryWeapon.name)
          : null;
      case SLOT_ARMOR:
        return props.character.equipment.armor.name
          ? ARMOR.items.find((w) => w.name === props.character.equipment.armor.name)
          : null;
    }

    return null;
  });

  const isWeaponType = computed(() => {
    return [
      ALL_WEAPON_TYPE,
      PRIMARY_WEAPON_TYPE,
      SECONDARY_WEAPON_TYPE,
    ].includes(props.type);
  });

  const inventoryWeapons = computed(() => {
    return props.character.inventory.weapons
      .map((w) => WEAPONS.items.find((weapon) => weapon.name === w.name))
      .filter((w) => props.type.includes(w?.slot));
  });

  const itemList = computed(() => {
    if (props.type === ALL_WEAPON_TYPE) {
      return [ ...WEAPONS.items ];
    }

    if (props.type === PRIMARY_WEAPON_TYPE) {
      return WEAPONS.items.filter((item) => item.slot === 'primary');
    }

    if (props.type === SECONDARY_WEAPON_TYPE) {
      return WEAPONS.items.filter((item) => item.slot === 'secondary');
    }

    if (props.type === ARMOR_TYPE) {
      return [ ...ARMOR.items ];
    }

    return [];
  });

  const showingAllWeapons = computed(() => {
    return props.type === ALL_WEAPON_TYPE;
  });

  const sortedItems = computed(() => {
    const tiers = props.startingOnly ? [1] : selectedTiers.value;

    return itemList.value
      .filter((item) => {
        const matchesTierFilter = tiers.includes(item.tier);
        // TODO: make a "show unavailable" toggle to bypass this
        const matchesMagicFilter = item.damageType !== 'magical' || isCaster.value;
        const matchesTypeFilter = !showingAllWeapons.value || selectedType.value.includes(item.slot);

        return matchesTierFilter &&
          matchesMagicFilter &&
          matchesTypeFilter;
      })
      .sort((a, b) => {
        if (!a.trait || !b.trait) return 0;

        const aTrait = a.trait.toLowerCase();
        const bTrait = b.trait.toLowerCase();

        if (aTrait === bestTrait.value && bTrait !== bestTrait.value) {
          return -1;
        }

        if (aTrait !== bestTrait.value && bTrait === bestTrait.value) {
          return 1;
        }

        return 0;
      });
  });

  const selectItem = (data) => {
    emit('select', data);
  };

  const removeItem = () => {
    emit(REMOVE_EQUIPPED_ITEM);
  };
</script>
