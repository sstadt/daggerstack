<template lang="pug">
  .container.p-8
    form(@submit.prevent="next").space-y-8
      h2.text-center.text-2xl.font-black.uppercase.mb-2 Starting Equipment
      h3.text-lg.font-bold.uppercase primary weapon
      div(v-if="primaryWeapon.name") {{ primaryWeapon.name }}
      BasicButton.block.mx-auto(v-else @click="openPicker(primaryWeaponType)") Select Weapon
      h3.text-lg.font-bold.uppercase secondary weapon
      div(v-if="secondaryWeapon.name") {{ secondaryWeapon.name }}
      BasicButton.block.mx-auto(v-else @click="openPicker(secondaryWeaponType)") Select Weapon
      h3.text-lg.font-bold.uppercase armor
      div(v-if="armor.name") {{ armor.name }}
      BasicButton.block.mx-auto(v-else @click="openPicker(armorType)") Select Armor
      .flex.justify-between.items-center
        NuxtLink(to="/") Finish Later
        BasicButton.block(type="submit") Next
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
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    methods: {
      openPicker(type) {
        this.$emit('pick-equipment', type);
      },
      selectItem(type, item) {
        console.log(type, item);
      },
      async next() {
        if (this.primaryWeapon.name && this.armor.name) {
          this.builderStore.updateCharacter({
            equipment: {
              primaryWeapon: this.weapon,
              secondaryWeapon: this.weapon,
              armor: this.armor,
            },
          });

          this.$emit('next');
        }
      },
    },
  };
</script>
