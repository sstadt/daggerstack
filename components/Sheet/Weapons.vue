<template lang="pug">
  BasicCard(title="Weapons")
    .flex.justify-center.mt-2.mb-4(@click="showBonuses")
      h3.uppercase.text-sm.font-bold.mr-4 Proficiency
      InputCheckbox(
        v-for="n in 6"
        :checked="proficiency >= n"
        read-only
      )
    .space-y-4
      .grid
      transition-group(name="slide-fade-left")
        .flex.space-x-2.items-center(v-for="weapon in character.inventory.weapons" :key="weapon.id")
          InventoryWeapon.cursor-pointer(
            :weapon-id="weapon.itemId"
            :character="character"
            :character-weapon="weapon"
          )
          .w-14
            transition(name="fade" mode="out-in")
              div(v-if="weapon.equipped === true") todo
              BasicButton(v-else size="xs" priority="secondary" @click="equip(weapon)") Equip
      .flex.justify-end(v-if="character.inventory?.weapons?.length < GENERAL.maxInventoryWeapons")
        BasicButton(size="sm" priority="secondary" @click="openPicker") Add Weapon
    SheetBonuses(
      ref="bonuses"
      statistic="proficiency"
      :bonuses="proficiencyBonuses"
    )
    BasicDrawer(ref="equipmentPicker" title="Weapons")
      InventoryEquipmentPicker(
        :type="pickerType"
        :character="character"
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
  import GENERAL from '~/data/general';
  import WEAPONS from '~/data/weapons';

  import { newWeapon } from '~/helpers/constructors';
  import {
    calculateModifiers,
    getFeaturesByAttribute,
    respectBurden,
  } from '~/helpers/character';

  import { PRIMARY_WEAPON_TYPE } from '~/config/equipmentPicker';

  const charactersStore = useCharactersStore();

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

  const shouldRespectBurden = computed(() => {
    return respectBurden(props.character);
  });

  const showBonuses = () => {
    bonuses.open();
  };

  const openPicker = () => {
    equipmentPicker.value.open();
  };

  const selectItem = ({ item }) => {
    if (props.character.inventory.weapons.length < GENERAL.maxInventoryWeapons) {
      props.character.inventory.weapons.push(newWeapon({ name: item.name, itemId: item.id }));
      charactersStore.saveCharacter(props.character);
    }

    equipmentPicker.value.close();
  };

  const removeEquippedItem = () => {
    // TODO
    // let itemRemoved = false;

    // if (activeSlot.value === SLOT_PRIMARY_WEAPON) {
    //   props.character.equipment.primaryWeapon = newWeapon();
    //   itemRemoved = true;
    // }

    // if (activeSlot.value === SLOT_SECONDARY_WEAPON) {
    //   props.character.equipment.secondaryWeapon = newWeapon();
    //   itemRemoved = true;
    // }

    // if (itemRemoved) {
    //   charactersStore.saveCharacter(props.character);
    //   equipmentPicker.value.close();
    // }
  };
</script>
