<template lang="pug">
  .container.p-8
    form(@submit.prevent="next").space-y-8
      h2.text-center.text-2xl.font-black.uppercase.mb-2 Starting Equipment
      div
        h3.text-lg.font-bold.uppercase.mb-2 primary weapon
        InventoryWeapon(
          v-if="primaryWeapon.name"
          :weapon="primaryWeapon"
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
          :weapon="secondaryWeapon"
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
          :armor="armor"
          @click="openPicker(armorType)"
        )
        BasicButton.block.mx-auto(
          v-else
          @click="openPicker(armorType)"
        ) Select Armor
      .flex.justify-between.items-center
        NuxtLink(to="/") Finish Later
        BasicButton.block(type="submit") Next
    BasicDrawer(ref="equipmentPicker" :title="pickerTitle")
      InventoryPicker(:type="activeType" @select="selectItem")
</template>

<script>
  import { useBuilderStore } from '~/stores/builder';

  import {
    PRIMARY_WEAPON_TYPE,
    SECONDARY_WEAPON_TYPE,
    ARMOR_TYPE,
  } from '~/config/equipmentPicker';

  export default {
    name: 'BuilderStep4',
    data() {
      const isNewCharacter = !this.builderStore.character.id;

      return {
        activeType: null,
        primaryWeaponType: PRIMARY_WEAPON_TYPE,
        secondaryWeaponType: SECONDARY_WEAPON_TYPE,
        armorType: ARMOR_TYPE,
        primaryWeapon: isNewCharacter
          ? {}
          : { ...this.builderStore.character.equipment.primaryWeapon },
        secondaryWeapon: isNewCharacter
          ? {}
          : { ...this.builderStore.character.equipment.secondaryWeapon },
        armor: isNewCharacter
          ? {}
          : { ...this.builderStore.character.equipment.armor },
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
      openPicker(type) {
        this.activeType = type;
        this.$refs.equipmentPicker.open();
      },
      selectItem({ item }) {
        this[this.activeType] = { ...item };
        this.$refs.equipmentPicker.close();
      },
      async next() {
        if (this.primaryWeapon.name && this.armor.name) {
          this.builderStore.updateCharacter({
            equipment: {
              primaryWeapon: this.primaryWeapon,
              secondaryWeapon: this.secondaryWeapon,
              armor: this.armor,
            },
          });

          this.$emit('next');
        }
      },
    },
  };
</script>
