<template lang="pug">
  .max-w-5xl.container.p-8
    form(@submit.prevent="next").space-y-8
      .space-y-4
        h2.text-center.text-2xl.font-black.uppercase.mb-2 Take
        .divide-y
          InventoryItem(v-for="item in items" :character-item="item" read-only)
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
          required
        )
        InputSelect.mb-8(
          v-model="selectedClassItem"
          :options="classChoice"
          label="class item"
          required
        )
      .flex.justify-between.items-center
        NuxtLink(to="/character") Finish Later
        BasicButton.block(type="submit") Next
</template>

<script>
  import { useVuelidate } from '@vuelidate/core';

  import GENERAL from '~/data/general';
  import CLASSES from '~/data/classes';

  import { createSelectOptions } from '~/helpers/array';
  import { newItem } from '~/helpers/constructors';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep3',
    data() {
      const classData = CLASSES[this.builderStore.baseClass];
      const existingItems = [ ...this.builderStore.character.inventory.items ];
      const spellbook = existingItems.find((i) => i.name.toLowerCase().includes('spellbook'));
      const existingGeneralItem = existingItems.find((i) => GENERAL.startingGear.choose.includes(i.name));
      const [ firstGeneralItem ] = GENERAL.startingGear.choose;
      const existingClassItem = existingItems.find((i) => classData.startingGear.choose.includes(i.name));
      const [ firstClassItem ] = classData.startingGear.choose;
      const items = [];

      GENERAL.startingGear.take.forEach((itemName) => {
        items.push(newItem({ name: itemName, custom: true }));
      });

      return {
        items,
        spellbook: spellbook ? spellbook.name.replace(' (spellbook)', '') : '',
        selectedGeneralItem: existingGeneralItem ? existingGeneralItem.name : firstGeneralItem,
        selectedClassItem: existingClassItem ? existingClassItem.name : firstClassItem,
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
        return createSelectOptions(GENERAL.startingGear.choose);
      },
      classChoice() {
        return CLASSES[this.builderStore.baseClass]
          ? createSelectOptions(CLASSES[this.builderStore.baseClass].startingGear.choose)
          : [];
      },
      spellBookPlaceholder() {
        return CLASSES[this.builderStore.baseClass] && CLASSES[this.builderStore.baseClass].startingGear.spellbook
          ? `${CLASSES[this.builderStore.baseClass].startingGear.spellbook.join(', ')}, etc.`
          : null;
      },
    },
    methods: {
      async next() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          let items = [ ...this.items ];

          if (CLASSES[this.builderStore.baseClass].startingGear.spellbook) {
            items.push(newItem({ name: this.spellbook, notes: 'Spellbook', custom: true }));
          }

          if (!items.includes(this.selectedGeneralItem)) {
            items.push(newItem({ name: this.selectedGeneralItem }));
          }

          if (!items.includes(this.selectedClassItem)) {
            items.push(newItem({ name: this.selectedClassItem, custom: true }));
          }

          this.builderStore.updateCharacter({ inventory: { items } });

          this.$emit('next');
        }
      },
    },
  };
</script>
