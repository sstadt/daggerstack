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
      transition-group(name="slide-fade-left")
        InventoryWeaponControls(
          v-for="(weapon, index) in character.inventory.weapons"
          :key="weapon.id"
          :character-weapon="weapon"
          @equip="equip(weapon)"
        )
          InventoryWeapon.cursor-pointer(
            :weapon="weaponsStore.weapon(weapon.itemId)"
            :character-weapon="weapon"
            :character="character"
            @update="(updates) => updateItem(updates, index)"
            @remove="removeItem(index)"
          )
      .flex.justify-end(v-if="character.inventory?.weapons?.length < GENERAL.maxInventoryWeapons")
        BasicButton(size="sm" priority="secondary" @click="openPicker") Add Weapon
    SheetBonuses(
      ref="bonuses"
      statistic="proficiency"
      :bonuses="proficiencyBonuses"
    )
    BasicDrawer(ref="equipmentPicker" title="Weapons")
      InventoryEquipmentPicker(type="weapon" :character="character" @select="selectItem")
</template>

<script>
  export default {
    name: 'SheetWeapons',
  };
</script>

<script setup>
  import GENERAL from '~/data/general';

  import { newWeapon } from '~/helpers/constructors';
  import { respectBurden } from '~/helpers/character';
  import { clone } from '~/helpers/utility';

  const charactersStore = useCharactersStore();
  const weaponsStore = useWeaponsStore();
  const { getFeaturesByAttribute, calculateModifiers } = useSheetBonuses();

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

  const selectItem = (item) => {
    if (props.character.inventory.weapons.length < GENERAL.maxInventoryWeapons) {
      props.character.inventory.weapons.push(newWeapon({ name: item.name, itemId: item.id }));
      charactersStore.saveCharacter(props.character);
    }

    equipmentPicker.value.close();
  };

  const equip = (equipWeapon) => {
    const equipData = weaponsStore.weapon(equipWeapon.itemId);

    props.character.inventory.weapons.forEach((carriedWeapon) => {
      const carriedData = weaponsStore.weapon(carriedWeapon.itemId);

      // equip weapon
      if (equipWeapon.id === carriedWeapon.id && !carriedWeapon.equipped) {
        carriedWeapon.equipped = true;
        return;
      }

      // unequip conflicting weapons
      if (
        equipWeapon.id !== carriedWeapon.id &&
        carriedWeapon.equipped &&
        (
          equipData.burden > 1 ||
          carriedData.burden > 1 ||
          equipData.slot === carriedData.slot
        )
      ) {
        carriedWeapon.equipped = false;
        return;
      }
    });

    charactersStore.saveCharacter(props.character);
  };

  const updateItem = (updates, index) => {
    const existingWeapon = { ...props.character.inventory.weapons[index] };
    const updatedWeapon = Object.assign(existingWeapon, updates);

    props.character.inventory.weapons.splice(index, 1, updatedWeapon);
    charactersStore.saveCharacter(props.character);
  };

  const removeItem = (index) => {
    props.character.inventory.weapons.splice(index, 1);
    charactersStore.saveCharacter(props.character);
  };
</script>
