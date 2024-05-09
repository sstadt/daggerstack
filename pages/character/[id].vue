<template lang="pug">
  .character
    Head
      Title Daggerstack.com - {{ characterName }}
    .flex.flex-col.items-center.justify-center.w-screen.h-screen.space-y-6(
      v-if="characterLoaded && !character.id"
    )
      p.text-4xl.text-center Could not find character!
      NuxtLink(to="/")
        BasicButton Go Back
    CharacterSheet(v-else-if="character && character.id" :character="character")
</template>

<script>
  import { mapState } from 'pinia';
  import { useCharactersStore } from '~/stores/characters';

  export default {
    name: 'CharacterPage',
    data() {
      return {
        character: null,
        characterLoaded: false,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      ...mapState(useCharactersStore, ['charactersLoaded']),
      characterName() {
        return this.character ? this.character.name : 'Loading Character...';
      },
    },
    mounted() {
      if (this.charactersLoaded === true) {
        this.loadCharacterFromState();
      }
    },
    methods: {
      loadCharacterFromState() {
        const routeCharacter = this.charactersStore.characterList
          .find((character) => {
            return character.id === this.$route.params.id;
          });

        this.character = { ...routeCharacter };
        this.characterLoaded = true;
      },
    },
    watch: {
      charactersLoaded(newVal) {
        if (this.characterLoaded === false && newVal === true) {
          this.loadCharacterFromState();
        }
      },
    },
  };
</script>
