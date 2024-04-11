<template lang="pug">
  .container.p-8
    form(@submit.prevent="next").space-y-8
      .space-y-4
        h2.text-center.text-2xl.font-black.uppercase.mb-2 Take
        InputTextarea(
          v-model="items"
          label="items"
        )
        InputText(
          v-if="spellBookPlaceholder"
          v-model="spellbook"
          label="spellbook"
          :placeholder="spellBookPlaceholder"
        )
      .space-y-4
        h2.text-center.text-2xl.font-black.uppercase.mb-4.mt-8 Choose
        InputSelect.mb-4(
          v-model="selectedGeneralItem"
          :options="generalChoice"
          label="potion"
        )
        InputSelect.mb-8(
          v-model="selectedClassItem"
          :options="classChoice"
          label="class item"
        )
      .flex.justify-between.items-center
        NuxtLink(to="/") Finish Later
        BasicButton.block(type="submit") Next
</template>

<script>
  import { useVuelidate } from '@vuelidate/core';

  import general from '~/data/general';
  import classes from '~/data/classes';

  import { createSelectOptions } from '~/helpers/array';
  import { separateItemsForBuilder } from '~/helpers/character';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep3',
    data() {
      const existingItems = this.builderStore.character.inventory.items;
      const {
        items,
        spellbook,
        generalItem,
        classItem,
      } = separateItemsForBuilder(existingItems, this.builderStore.baseClass);

      return {
        items,
        spellbook,
        selectedGeneralItem: generalItem,
        selectedClassItem: classItem,
      };
    },
    setup() {
      const builderStore = useBuilderStore();

      return {
        builderStore,
        v$: useVuelidate(),
      };
    },
    computed: {
      generalChoice() {
        return createSelectOptions(general.startingGear.choose);
      },
      classChoice() {
        return classes[this.builderStore.baseClass]
          ? createSelectOptions(classes[this.builderStore.baseClass].startingGear.choose)
          : [];
      },
      spellBookPlaceholder() {
        return classes[this.builderStore.baseClass] && classes[this.builderStore.baseClass].startingGear.spellbook
          ? `${classes[this.builderStore.baseClass].startingGear.spellbook.join(', ')}, etc.`
          : null;
      },
    },
    methods: {
      async next() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          let items = this.items;
          const spellbook = `${this.spellbook} (spellbook)`;

          if (!items.includes(spellbook) && this.spellbook !== '') {
            items = `${items}, ${spellbook}`;
          }

          if (!items.includes(this.selectedGeneralItem)) {
            items = `${items}, ${this.selectedGeneralItem}`;
          }

          if (!items.includes(this.selectedClassItem)) {
            items = `${items}, ${this.selectedClassItem}`;
          }

          this.builderStore.updateCharacter({ inventory: { items } });

          this.$emit('next');
        }
      },
    },
  };
</script>
