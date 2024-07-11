<template lang="pug">
  .flex.flex-col.h-full-minus-topbar
    .flex.flex-col.flex-grow.overflow-y-auto
      Transition(name="fade" mode="out-in")
        .flex.items-center.justify-center.flex-grow(v-if="!hydrated")
          BasicLoader
        ul.flex-shrink-0.overflow-hidden(v-else-if="characterList.length > 0")
          li(
            v-for="(character, index) in characterList"
            :class="{ 'border-t': index !== 0 }"
          )
            CharacterLink(:character="character" @delete="deleteCharacter(character)")
        .flex.items-center.justify-center.flex-grow(v-else)
          p.text-4xl.text-center You don't have any characters.... yet!
    Transition(name="slide-fade-bottom")
      .flex.flex-col(v-if="hydrated && characterList.length < 10")
        NuxtLink(to="/builder")
          BasicButton.rounded-none.w-full(v-if="character?.baseClass")
            | {{ characterLabel }}
        NuxtLink(:to="{ name: 'builder', query: { new: true } }")
          BasicButton.rounded-none.w-full
            | New Character
    DialogConfirm(ref="confirm" @cancel="cancelDelete" @confirm="confirmDelete")
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
        activeDeleteId: null,
      };
    },
    computed: {
      ...mapState(useBuilderStore, ['character']),
      ...mapState(useCharactersStore, ['characterList', 'hydrated']),
      characterLabel() {
        return this.character.baseClass && this.character.baseClass !== ''
          ? `Resume ${this.character.baseClass}`
          : 'Resume Character';
      },
    },
    methods: {
      createNewCharacter(clearBuilder) {
        if (clearBuilder) this.builderStore.newCharacter();
        this.builderStore.open();
      },
      confirmDelete() {
        this.charactersStore.deleteCharacter(this.activeDeleteId);
        this.activeDeleteId = null;
      },
      cancelDelete() {
        this.activeDeleteId = null;
      },
      deleteCharacter(character) {
        this.activeDeleteId = character.id;
        this.$refs.confirm
          .ask(`Are you sure you want to delete ${character.name}? This cannot be undone`);
      },
    },
  };
</script>
