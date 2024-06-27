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
          :class="{ 'opacity-20 pointer-events-none': respectBurden && isPrimaryTwoHanded }"
          :type="secondaryWeaponType"
          @click="openPicker(secondaryWeaponType)"
        )
        .absolute.transform.text-2xl.text-red-600.uppercase.w-full.text-center.font-black(
          v-if="respectBurden && isPrimaryTwoHanded"
          class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ) No free hands
      BasicButton.mx-auto.block(v-else @click="openPicker(secondaryWeaponType)")
        | Select Weapon
    BasicDrawer(ref="equipmentPicker" title="Weapons")
      InventoryPicker(
        :type="pickerType"
        :character="character"
        :active-slot="activeSlot"
        include-inventory
        @select="selectItem"
        @remove-equipped-item="removeEquippedItem"
      )
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';
  import {
    newWeapon,
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
        activeSlot: null,
        pickerType: PRIMARY_WEAPON_TYPE,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      baseProficiency() {
        // base of 1 proficiency + 1 for each tier
        return Math.floor((this.character.level + 1) / 3) + 1;
      },
      proficiency() {
        const modifiers = getFeaturesByAttribute(this.character, 'proficiency');

        return this.baseProficiency + calculateModifiers(modifiers, 'proficiency');
      },
      isPrimaryTwoHanded() {
        return this.character.equipment.primaryWeapon.burden > 1;
      },
      respectBurden() {
        return respectBurden(this.character);
      },
    },
    methods: {
      openPicker(weaponType) {
        this.pickerType = weaponType === PRIMARY_WEAPON_TYPE
          ? PRIMARY_WEAPON_TYPE
          : SECONDARY_WEAPON_TYPE;
        this.activeSlot = weaponType === PRIMARY_WEAPON_TYPE
          ? SLOT_PRIMARY_WEAPON
          : SLOT_SECONDARY_WEAPON;

        this.$refs.equipmentPicker.open();
      },
      selectItem({ item, fromInventory = false }) {
        let weaponUpdated = false;

        if (fromInventory === true) {
          const currentWeapon = this.activeSlot === SLOT_PRIMARY_WEAPON
            ? { ...this.primaryWeapon }
            : { ...this.secondaryWeapon };

          this.character.inventory.weapon = currentWeapon;
          weaponUpdated = true;
        }

        if (this.activeSlot === SLOT_PRIMARY_WEAPON) {
          this.primaryWeapon = { ...item };
          this.character.equipment.primaryWeapon = { ...item };
          weaponUpdated = true;
        }

        if (this.activeSlot === SLOT_SECONDARY_WEAPON) {
          this.secondaryWeapon = { ...item };
          this.character.equipment.secondaryWeapon = { ...item };
          weaponUpdated = true;
        }

        if (weaponUpdated) {
          this.charactersStore.saveCharacter(this.character);
        }

        this.$refs.equipmentPicker.close();
      },
      removeEquippedItem() {
        let itemRemoved = false;

        if (this.activeSlot === SLOT_PRIMARY_WEAPON) {
          this.character.equipment.primaryWeapon = newWeapon();
          itemRemoved = true;
        }

        if (this.activeSlot === SLOT_SECONDARY_WEAPON) {
          this.character.equipment.secondaryWeapon = newWeapon();
          itemRemoved = true;
        }

        if (itemRemoved) {
          this.charactersStore.saveCharacter(this.character);
          this.$refs.equipmentPicker.close();
        }
      },
    },
  };
</script>
