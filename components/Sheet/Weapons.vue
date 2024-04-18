<template lang="pug">
  BasicCard(title="Active Weapons")
    .flex.justify-center.mt-2.mb-4
      h3.uppercase.text-sm.font-bold.mr-4 Proficiency
      InputCheckbox(
        v-for="n in 6"
        :checked="proficiency >= n"
        read-only
      )
    .pb-8.border-b.mb-8.space-y-4
      h3.text-xl.font-black.uppercase.mt-6 Primary
      InventoryWeapon(
        v-if="character && character.equipment.primaryWeapon.name"
        :weapon="character.equipment.primaryWeapon"
        @click="openPicker(primaryWeaponType)"
      )
      BasicButton.mx-auto.block(v-else @click="openPicker(primaryWeaponType)")
        | Select Weapon
    .space-y-4
      h3.text-xl.font-black.uppercase Secondary
      .relative(v-if="character && character.equipment.secondaryWeapon.name")
        InventoryWeapon(
          :weapon="character.equipment.secondaryWeapon"
          :class="{ 'opacity-20 pointer-events-none': isPrimaryTwoHanded }"
          @click="openPicker(secondaryWeaponType)"
        )
        .absolute.transform.text-2xl.text-red-600.uppercase.w-full.text-center.font-black(
          v-if="isPrimaryTwoHanded"
          class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ) No free hands
      BasicButton.mx-auto.block(v-else @click="openPicker(secondaryWeaponType)")
        | Select Weapon
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';

  import { OPEN_EQUIPMENT_PICKER } from '~/config/events';
  import {
    PRIMARY_WEAPON_TYPE,
    SECONDARY_WEAPON_TYPE,
    SLOT_PRIMARY_WEAPON,
    SLOT_SECONDARY_WEAPON,
  } from '~/config/equipmentPicker';

  export default {
    name: 'SheetWeapons',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        primaryWeapon: this.character.equipment.primaryWeapon,
        secondaryWeapon: this.character.equipment.secondaryWeapon,
        primaryWeaponType: PRIMARY_WEAPON_TYPE,
        secondaryWeaponType: SECONDARY_WEAPON_TYPE,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      proficiency() {
        return this.character.proficiency;
      },
      isPrimaryTwoHanded() {
        return this.character.equipment.primaryWeapon.burden > 1;
      },
    },
    methods: {
      openPicker(weaponType) {
        const type = weaponType === PRIMARY_WEAPON_TYPE
          ? PRIMARY_WEAPON_TYPE
          : SECONDARY_WEAPON_TYPE;
        const slot = weaponType === PRIMARY_WEAPON_TYPE
          ? SLOT_PRIMARY_WEAPON
          : SLOT_SECONDARY_WEAPON;

        this.$emit(OPEN_EQUIPMENT_PICKER, { type, slot });
      },
      selectItem(weapon, slot, fromInventory = false) {
        let weaponUpdated = false;

        if (fromInventory) {
          const currentWeapon = slot === SLOT_PRIMARY_WEAPON
            ? { ...this.primaryWeapon }
            : { ...this.secondaryWeapon };

          this.character.inventory.weapon = currentWeapon;
          weaponUpdated = true;
        }

        if (slot === SLOT_PRIMARY_WEAPON) {
          this.primaryWeapon = { ...weapon };
          this.character.equipment.primaryWeapon = { ...weapon };
          weaponUpdated = true;
        }

        if (slot === SLOT_SECONDARY_WEAPON) {
          this.secondaryWeapon = { ...weapon };
          this.character.equipment.secondaryWeapon = { ...weapon };
          weaponUpdated = true;
        }

        if (weaponUpdated) {
          this.charactersStore.saveCharacter(this.character);
        }
      },
    },
  };
</script>
