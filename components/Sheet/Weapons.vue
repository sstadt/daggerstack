<template lang="pug">
  BasicCard(title="Active Weapons")
    .flex.justify-center.mt-2.mb-4(@click="showBonuses")
      h3.uppercase.text-sm.font-bold.mr-4 Proficiency
      InputCheckbox(
        v-for="n in 6"
        :checked="proficiency >= n"
        read-only
      )
    .mb-8.space-y-4
      h3.font-black.uppercase.mt-6 Primary
      InventoryWeapon.cursor-pointer(
        v-if="primaryWeapon"
        :weapon="getWeapon(primaryWeapon.name)"
        :character-weapon="character.equipment.primaryWeapon"
        :character="character"
        @click="openPicker(primaryWeaponType)"
      )
      BasicButton.mx-auto.block(
        v-else
        priority="secondary"
        @click="openPicker(primaryWeaponType)"
      ) Select Weapon
    .space-y-4
      h3.font-black.uppercase Secondary
      .relative(v-if="secondaryWeapon")
        InventoryWeapon.cursor-pointer(
          :weapon="getWeapon(secondaryWeapon.name)"
          :character-weapon="character.equipment.secondaryWeapon"
          :character="character"
          :class="{ 'opacity-20 pointer-events-none': shouldRespectBurden && isPrimaryTwoHanded }"
          @click="openPicker(secondaryWeaponType)"
        )
        .absolute.transform.text-2xl.text-red-600.uppercase.w-full.text-center.font-black(
          v-if="shouldRespectBurden && isPrimaryTwoHanded"
          class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ) No free hands
      BasicButton.mx-auto.block(
        v-else
        priority="secondary"
        @click="openPicker(secondaryWeaponType)"
      ) Select Weapon
    SheetBonuses(
      ref="bonuses"
      statistic="proficiency"
      :bonuses="proficiencyBonuses"
    )
    BasicDrawer(ref="equipmentPicker" title="Weapons")
      InventoryEquipmentPicker(
        :type="pickerType"
        :character="character"
        :active-slot="activeSlot"
        include-inventory
        @select="selectItem"
        @remove-equipped-item="removeEquippedItem"
      )
</template>

<script>
  export default {
    name: 'SheetWeapons',
  };
</script>

<script setup>
  import WEAPONS from '~/data/weapons';

  import { newWeapon } from '~/helpers/constructors';
  import {
    getWeapon,
    calculateModifiers,
    getFeaturesByAttribute,
    respectBurden,
  } from '~/helpers/character';

  import {
    PRIMARY_WEAPON_TYPE,
    SECONDARY_WEAPON_TYPE,
    SLOT_PRIMARY_WEAPON,
    SLOT_SECONDARY_WEAPON,
  } from '~/config/equipmentPicker';

  const charactersStore = useCharactersStore();

  const primaryWeaponType = ref(PRIMARY_WEAPON_TYPE);
  const secondaryWeaponType = ref(SECONDARY_WEAPON_TYPE);
  const activeSlot = ref(null);
  const pickerType = ref(PRIMARY_WEAPON_TYPE);
  const baseProficiency = ref(1);
  const equipmentPicker = ref(null);
  const bonuses = ref(null);

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const proficiencyBonuses = computed(() => {
    const bonuses = getFeaturesByAttribute(props.character, 'proficiency');

    if (props.character.level > 1) {
      bonuses.push({
        name: 'Level 2 (auto)',
        modify: { proficiency: 1 },
      });
    }

    if (props.character.level > 4) {
      bonuses.push({
        name: 'Level 5 (auto)',
        modify: { proficiency: 1 },
      });
    }

    if (props.character.level > 7) {
      bonuses.push({
        name: 'Level 8 (auto)',
        modify: { proficiency: 1 },
      });
    }

    return bonuses;
  });

  const proficiency = computed(() => {
    return baseProficiency.value + calculateModifiers(proficiencyBonuses.value, 'proficiency');
  });

  const primaryWeapon = computed(() => {
    return props.character.equipment.primaryWeapon.name
      ? WEAPONS.items.find((weapon) => props.character.equipment.primaryWeapon.name === weapon.name)
      : null;
  });

  const secondaryWeapon = computed(() => {
    return props.character.equipment.secondaryWeapon.name
      ? WEAPONS.items.find((weapon) => props.character.equipment.secondaryWeapon.name === weapon.name)
      : null;
  });

  const isPrimaryTwoHanded = computed(() => {
    return primaryWeapon.value?.burden > 1;
  });

  const shouldRespectBurden = computed(() => {
    return respectBurden(props.character);
  });

  const showBonuses = () => {
    bonuses.open();
  };

  const openPicker = (weaponType) => {
    pickerType.value = weaponType === PRIMARY_WEAPON_TYPE
      ? PRIMARY_WEAPON_TYPE
      : SECONDARY_WEAPON_TYPE;
    activeSlot.value = weaponType === PRIMARY_WEAPON_TYPE
      ? SLOT_PRIMARY_WEAPON
      : SLOT_SECONDARY_WEAPON;

    equipmentPicker.value.open();
  };

  const selectItem = ({ item, fromInventory = false }) => {
    let weaponUpdated = false;

    // swap from inventory
    if (fromInventory === true) {
      const inventoryIndex = props.character.inventory.weapons.findIndex((w) => w.name === item);
      const inventoryWeapon = { ...props.character.inventory.weapons[inventoryIndex] };
      const currentWeapon = activeSlot.value === SLOT_PRIMARY_WEAPON
        ? { ...props.character.equipment.primaryWeapon }
        : { ...props.character.equipment.secondaryWeapon };

      props.character.equipment[activeSlot.value] = inventoryWeapon;
      props.character.inventory.weapons.splice(inventoryIndex, 1, currentWeapon);
      weaponUpdated = true;

    // new primary weapon
    } else if (activeSlot.value === SLOT_PRIMARY_WEAPON) {
      props.character.equipment.primaryWeapon = newWeapon({ name: item });
      weaponUpdated = true;

    // new secondary weapon
    } else if (activeSlot.value === SLOT_SECONDARY_WEAPON) {
      props.character.equipment.secondaryWeapon = newWeapon({ name: item });
      weaponUpdated = true;
    }

    if (weaponUpdated) {
      charactersStore.saveCharacter(props.character);
    }

    equipmentPicker.value.close();
  };

  const removeEquippedItem = () => {
    let itemRemoved = false;

    if (activeSlot.value === SLOT_PRIMARY_WEAPON) {
      props.character.equipment.primaryWeapon = newWeapon();
      itemRemoved = true;
    }

    if (activeSlot.value === SLOT_SECONDARY_WEAPON) {
      props.character.equipment.secondaryWeapon = newWeapon();
      itemRemoved = true;
    }

    if (itemRemoved) {
      charactersStore.saveCharacter(props.character);
      equipmentPicker.value.close();
    }
  };
</script>
