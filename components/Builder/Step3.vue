<template lang="pug">
  .container.p-8.space-y-8
    .space-y-4
      h2.text-center.text-2xl.font-black.uppercase.mb-2 Take
      InputTextarea(v-model="items" label="items")
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
    BasicButton.block.ml-auto(@click="next") Next
</template>

<script>
  import general from '~/data/general';
  import classes from '~/data/classes';

  import { createSelectOptions } from '~/helpers/array';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep3',
    data() {
      return {
        items: general.startingGear.take.join(', '),
        spellbook: '',
        selectedGeneralItem: '',
        selectedClassItem: '',
      };
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
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
      next() {
        let items = this.items;
        const spellbook = `${this.spellbook} (spellbook)`;

        if (!items.includes(spellbook)) items = `${items}, ${spellbook}`;
        if (!items.includes(this.selectedGeneralItem)) items = `${items}, ${this.selectedGeneralItem}`;
        if (!items.includes(spellbook)) items = `${items}, ${this.selectedClassItem}`;

        this.builderStore.updateCharacter({ inventory: { items } });

        this.$emit('next');
      },
    },
  };
</script>
