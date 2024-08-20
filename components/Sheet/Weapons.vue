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
          :class="{ 'opacity-20 pointer-events-none': respectBurden && isPrimaryTwoHanded }"
          @click="openPicker(secondaryWeaponType)"
        )
        .absolute.transform.text-2xl.text-red-600.uppercase.w-full.text-center.font-black(
          v-if="respectBurden && isPrimaryTwoHanded"
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
  import WEAPONS from '~/data/weapons';

  import { useCharactersStore } from '~/stores/characters';

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
        baseProficiency: 1,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      proficiencyBonuses() {
        const bonuses = getFeaturesByAttribute(this.character, 'proficiency');

        if (this.character.level > 1) {
          bonuses.push({
            name: 'Level 2 (auto)',
            modify: { proficiency: 1 },
          });
        }

        if (this.character.level > 4) {
          bonuses.push({
            name: 'Level 5 (auto)',
            modify: { proficiency: 1 },
          });
        }

        if (this.character.level > 7) {
          bonuses.push({
            name: 'Level 8 (auto)',
            modify: { proficiency: 1 },
          });
        }

        return bonuses;
      },
      proficiency() {
        return this.baseProficiency + calculateModifiers(this.proficiencyBonuses, 'proficiency');
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
      showBonuses() {
        this.$refs.bonuses.open();
      },
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
          const inventoryIndex = this.character.inventory.weapons.findIndex((w) => w.name === item);
          const inventoryWeapon = { ...this.character.inventory.weapons[inventoryIndex] };
          const currentWeapon = this.activeSlot === SLOT_PRIMARY_WEAPON
            ? { ...this.character.equipment.primaryWeapon }
            : { ...this.character.equipment.secondaryWeapon };

          this.character.equipment[this.activeSlot] = inventoryWeapon;
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
