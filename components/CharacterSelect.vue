<template lang="pug">
  .flex.flex-col.h-full.max-h-screen
    .flex.flex-col.flex-grow.overflow-y-auto
      ul.flex-shrink-0(v-if="characterList.length > 0")
        li(v-for="(character, index) in characterList")
          NuxtLink.block.text-3xl.p-6.w-full.text-left(
            :class="{ 'border-t': index !== 0 }"
            class="hover:bg-slate-200 focus:slate-200"
            :to="`/character/${character.id}`"
          ) {{ character.name }}
      .flex.items-center.justify-center.flex-grow(v-else)
        p.text-4xl.text-center You don't have any characters.... yet!
    .flex.flex-col
      BasicButton.rounded-none(
        v-if="character && character.id"
        @click="builderStore.open"
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
        if (clearBuilder) this.builderStore.newCharacter();
        this.builderStore.open();
      },
    },
  };
</script>
