<template lang="pug">
  .max-w-5xl.container.p-8
    form(@submit.prevent="next").space-y-8
      h2.text-center.text-2xl.font-black.uppercase.mb-2 Starting Equipment
      div
        h3.text-lg.font-bold.uppercase.mb-2 primary weapon
        InventoryWeapon(
          v-if="primaryWeapon.name"
          :weapon="getWeapon(primaryWeapon.name)"
          @click="openPicker(primaryWeaponType)"
        )
        BasicButton.block.mx-auto(
          v-else
          @click="openPicker(primaryWeaponType)"
        ) Select Weapon
      div
        h3.text-lg.font-bold.uppercase.mb-2 secondary weapon
        InventoryWeapon(
          v-if="secondaryWeapon.name"
          :weapon="getWeapon(secondaryWeapon.name)"
          @click="openPicker(secondaryWeaponType)"
        )
        BasicButton.block.mx-auto(
          v-else
          @click="openPicker(secondaryWeaponType)"
        ) Select Weapon
      div
        h3.text-lg.font-bold.uppercase.mb-2 armor
        InventoryArmor(
          v-if="armor.name"
          :armor="getArmor(armor.name)"
          @click="openPicker(armorType)"
        )
        BasicButton.block.mx-auto(
          v-else
          @click="openPicker(armorType)"
        ) Select Armor
      .flex.justify-between.items-center
        NuxtLink(to="/character") Finish Later
        BasicButton.block(type="submit") Next
    BasicDrawer(ref="equipmentPicker" :title="pickerTitle")
      InventoryEquipmentPicker(
        :character="builderStore.character"
        :type="activeType"
        starting-only
        @select="selectItem"
      )
</template>

<script>
  import { useBuilderStore } from '~/stores/builder';

  import { newWeapon, newArmor } from '~/helpers/constructors';
  import { getWeapon, getArmor } from '~/helpers/character';

  import {
    PRIMARY_WEAPON_TYPE,
    SECONDARY_WEAPON_TYPE,
    ARMOR_TYPE,
  } from '~/config/equipmentPicker';

  export default {
    name: 'BuilderStep4',
    data() {
      return {
        activeType: null,
        primaryWeaponType: PRIMARY_WEAPON_TYPE,
        secondaryWeaponType: SECONDARY_WEAPON_TYPE,
        armorType: ARMOR_TYPE,
        primaryWeapon: this.builderStore.character.equipment.primaryWeapon.name
          ? { ...this.builderStore.character.equipment.primaryWeapon }
          : newWeapon(),
        secondaryWeapon: this.builderStore.character.equipment.secondaryWeapon.name
          ? { ...this.builderStore.character.equipment.secondaryWeapon }
          : newWeapon(),
        armor: this.builderStore.character.equipment.armor.name
          ? { ...this.builderStore.character.equipment.armor }
          : newArmor(),
      };
    },
    computed: {
      pickerTitle() {
        return this.activeType === ARMOR_TYPE ? 'Armor' : 'Weapons';
      },
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    methods: {
      getWeapon,
      getArmor,
      openPicker(type) {
        this.activeType = type;
        this.$refs.equipmentPicker.open();
      },
      selectItem({ item }) {
        this[this.activeType] = this.activeType === ARMOR_TYPE
          ? newArmor({ name: item })
          : newWeapon({ name: item });
        this.$refs.equipmentPicker.close();
      },
      async next() {
        if (this.primaryWeapon.name && this.armor.name) {
          this.builderStore.updateCharacter({
            equipment: {
              primaryWeapon: { ...this.primaryWeapon },
              secondaryWeapon: { ...this.secondaryWeapon },
              armor: { ...this.armor },
            },
          });

          this.$emit('next');
        }
      },
    },
  };
</script>
