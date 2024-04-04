<template lang="pug">
  .flex.flex-col.justify-center.items-center.min-h-full
    .text-4xl.text-center.space-y-6.mb-16
      p You don't have any characters.... yet!
    BasicButton(@click="createNewCharacter")
      | Resume Character
    BasicButton(@click="createNewCharacter(true)")
      | New Character
</template>

<script>
  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'CharacterSelect',
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    methods: {
      createNewCharacter(clearBuilder) {
        if (clearBuilder) this.builderStore.createCharacter();
        this.builderStore.open();
      },
    },
  };
</script>
