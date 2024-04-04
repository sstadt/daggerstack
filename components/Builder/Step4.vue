<template lang="pug">
  .container.p-8
    form(@submit.prevent="next").space-y-8
      h2.text-center.text-2xl.font-black.uppercase.mb-2 Starting Equipment
      InventoryWeapon(v-model="weapon" title="weapon" :validation="v$.weapon")
      InventoryArmor(v-model="armor" title="armor" :validation="v$.armor")
      BasicButton.block.ml-auto(type="submit") Next
</template>

<script>
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  import { newWeapon, newArmor } from '~/helpers/character';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep4',
    data() {
      const isNewCharacter = !this.builderStore.character.id;

      return {
        weapon: isNewCharacter ? newWeapon() : { ...this.builderStore.character.equipment.weapon },
        armor: isNewCharacter ? newArmor() : { ...this.builderStore.character.equipment.armor },
      };
    },
    validations() {
      return {
        weapon: {
          name: { required },
          trait: { required },
          damage: { required },
        },
        armor: {
          name: { required },
          score: { required },
        },
      };
    },
    setup() {
      const builderStore = useBuilderStore();

      return {
        builderStore,
        v$: useVuelidate(),
      };
    },
    methods: {
      async next() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          this.builderStore.updateCharacter({
            equipment: {
              weapon: this.weapon,
              armor: this.armor,
            },
          });

          this.$emit('next');
        }
      },
    },
  };
</script>
