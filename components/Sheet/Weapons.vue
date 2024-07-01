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
        v-if="primaryWeapon.name"
        :weapon="getWeapon(primaryWeapon.name)"
        @click="openPicker(primaryWeaponType)"
      )
      BasicButton.mx-auto.block(v-else @click="openPicker(primaryWeaponType)")
        | Select Weapon
    .space-y-4
      h3.text-xl.font-black.uppercase Secondary
      .relative(v-if="secondaryWeapon.name")
        InventoryWeapon(
          :weapon="getWeapon(secondaryWeapon.name)"
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
  import WEAPONS from '~/data/weapons';

  import { useCharactersStore } from '~/stores/characters';
  import {
    newWeapon,
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
      primaryWeapon() {
        return this.character.equipment.primaryWeapon.name
          ? WEAPONS.items.find((weapon) => this.character.equipment.primaryWeapon.name === weapon.name)
          : null;
      },
      secondaryWeapon() {
        return this.character.equipment.secondaryWeapon.name
          ? WEAPONS.items.find((weapon) => this.character.equipment.secondaryWeapon.name === weapon.name)
          : null;
      },
      isPrimaryTwoHanded() {
        return this.primaryWeapon.burden > 1;
      },
      respectBurden() {
        return respectBurden(this.character);
      },
    },
    methods: {
      getWeapon,
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

        // swap from inventory
        if (fromInventory === true) {
          const inventoryIndex = this.character.inventory.weapons.find((w) => w.name === item);
          const inventoryWeapon = { ...this.character.inventory.weapons[inventoryIndex] };
          const currentWeapon = this.activeSlot === SLOT_PRIMARY_WEAPON
            ? { ...this.character.equipment.primaryWeapon }
            : { ...this.character.equipment.secondaryWeapon };

          this.character.equipment[this.activeSlot] === inventoryWeapon;
          this.character.inventory.weapons =
            this.character.inventory.weapons.splice(inventoryIndex, 1, currentWeapon);
          weaponUpdated = true;

        // new primary weapon
        } else if (this.activeSlot === SLOT_PRIMARY_WEAPON) {
          this.character.equipment.primaryWeapon = newWeapon({ name: item });
          weaponUpdated = true;

        // new secondary weapon
        } else if (this.activeSlot === SLOT_SECONDARY_WEAPON) {
          this.character.equipment.secondaryWeapon = newWeapon({ name: item });
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
