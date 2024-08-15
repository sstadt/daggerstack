<template lang="pug">
  .flex.flex-col.h-full-minus-nav
    .flex.flex-col.flex-grow(:class="{ 'container': mq.lgPlus }")
      h1.text-3xl.py-6.uppercase(:class="titleClass") Characters
      Transition(name="fade" mode="out-in")
        .flex.items-center.justify-center.flex-grow(v-if="!hydrated")
          BasicLoader
        TransitionGroup.flex-shrink-0.overflow-hidden(
          v-else-if="characterList.length > 0"
          name="slide-fade-left"
          tag="ul"
        )
          li(
            v-for="(character, index) in characterList"
            :class="{ 'border-t': index !== 0 }"
            :key="character.id"
          )
            CharacterLink(:character="character" @delete="deleteCharacter(character)")
        .flex.items-center.justify-center.flex-grow(v-else)
          p.text-4xl.text-center You don't have any characters.... yet!
      Transition(name="slide-fade-bottom")
        .flex.flex-col.py-6.mt-auto(v-if="hydrated && characterList.length < 10")
          NuxtLink(to="/builder")
            BasicButton.rounded-none.w-full(v-if="character?.baseClass" class="lg:rounded-t")
              | {{ characterLabel }}
          NuxtLink(:to="{ name: 'builder', query: { new: true } }")
            BasicButton.rounded-none.w-full(:class="newCharacterButtonClass" priority="secondary")
              | New Character
    DialogConfirm(ref="confirm" @cancel="cancelDelete" @confirm="confirmDelete")
</template>

<script>
  import { mapState } from 'pinia';

  import { useBuilderStore } from '~/stores/builder';
  import { useCharactersStore } from '~/stores/characters';

  export default {
    name: 'CharacterSelect',
    inject: ['mq'],
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
      ...mapState(useUserStore, ['user', 'loaded']),
      ...mapState(useBuilderStore, ['character']),
      ...mapState(useCharactersStore, ['characterList', 'hydrated']),
      characterLabel() {
        return this.character.baseClass && this.character.baseClass !== ''
          ? `Resume ${this.character.baseClass}`
          : 'Resume Character';
      },
      titleClass() {
        return {
          'px-6 border-b': this.mq.mdMinus,
          'py-12': this.mq.lgPlus,
        };
      },
      newCharacterButtonClass() {
        return {
          'lg:rounded-b': this.character?.baseClass,
          'lg:rounded': !this.character?.baseClass,
        };
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
    watch: {
      loaded(newVal, oldVal) {
        if (newVal && !oldVal && !user) {
          this.$router.push('/');
        }
      },
    },
  };
</script>
