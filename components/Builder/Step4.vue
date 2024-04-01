<template lang="pug">
  .container.p-8.space-y-8
    h2.text-center.text-2xl.font-black.uppercase.mb-2 StartingEquipment
    InventoryWeapon(v-model="weapon" title="weapon")
    InventoryArmor(v-model="armor" title="armor")
    BasicButton.block.ml-auto(@click="next") Next
</template>

<script>
  import { newWeapon, newArmor } from '~/helpers/character';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep4',
    data() {
      return {
        weapon: newWeapon(),
        armor: newArmor(),
      };
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    methods: {
      next() {
        this.builderStore.updateEquipment({
          weapon: this.weapon,
          armor: this.armor,
        });

        this.$emit('next');
      },
    },
  };
</script>
