<template lang="pug">
  .flex.flex-col.h-full.max-h-screen
    .flex.flex-col.flex-grow.overflow-y-auto
      ul.flex-shrink-0(v-if="characterList.length > 0")
        li(v-for="(character, index) in characterList")
          a.block.text-3xl.p-6(
            :class="{ 'border-t': index !== 0 }"
          ) {{ character.name }}
      .flex.items-center.justify-center.flex-grow(v-else)
        p.text-4xl.text-center You don't have any characters.... yet!
    .flex.flex-col
      BasicButton.rounded-none(
        v-if="character.id"
        @click="createNewCharacter"
      ) {{ characterLabel }}
      BasicButton.rounded-none(@click="createNewCharacter(true)") New Character
</template>

<script>
  import { mapState } from 'pinia';

  import { useBuilderStore } from '~/stores/builder';
  import { useCharactersStore } from '~/stores/characters';

  export default {
    name: 'CharacterSelect',
    setup() {
      const builderStore = useBuilderStore();
      const charactersStore = useCharactersStore();

      return {
        builderStore,
        charactersStore,
      };
    },
    computed: {
      ...mapState(useBuilderStore, ['character']),
      ...mapState(useCharactersStore, ['characterList']),
      characterLabel() {
        return this.character.baseClass && this.character.baseClass !== ''
          ? `Resume ${this.character.baseClass}`
          : 'Resume Character'
      },
    },
    methods: {
      createNewCharacter(clearBuilder) {
        if (clearBuilder) this.builderStore.createCharacter();
        this.builderStore.open();
      },
    },
  };
</script>
