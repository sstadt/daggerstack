<template lang="pug">
  .flex.flex-col.justify-center.items-center.min-h-full
    .text-4xl.text-center.space-y-6.mb-16
      p You don't have any characters.... yet!
    BasicButton(@click="createNewCharacter")
      | New Character
</template>

<script>
  import { mapState } from 'pinia';
  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'CharacterSelect',
    computed: {
      ...mapState(useBuilderStore, ['isOpen']),
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    methods: {
      createNewCharacter() {
        this.builderStore.open();
      },
    },
  };
</script>
