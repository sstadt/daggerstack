<template lang="pug">
  .character
    Head
      Title Daggerstack.com - {{ characterName }}
    Transition(name="fade" mode="out-in")
      .flex.flex-col.items-center.justify-center.w-screen.h-full-minus-nav.space-y-6(
        v-if="hydrated && !character?.id"
      )
        p.text-4xl.text-center Could not find character!
        NuxtLink(to="/character")
          BasicButton Go Back
      CharacterSheet(v-else-if="character?.id" :character="character")
      .flex.flex-col.items-center.justify-center.h-full-minus-nav(v-else)
        BasicLoader
</template>

<script>
  import { mapState } from 'pinia';
  import { useCharactersStore } from '~/stores/characters';
  import { clone } from '~/helpers/utility';

  export default {
    name: 'CharacterPage',
    data() {
      return {
        character: null,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      ...mapState(useCharactersStore, ['hydrated']),
      characterName() {
        return this.character ? this.character.name : 'Loading Character...';
      },
    },
    mounted() {
      if (this.hydrated === true) {
        this.loadCharacter();
      }
    },
    methods: {
      loadCharacter() {
        const routeCharacter = this.charactersStore.characterList
          .find((character) => {
            return character.id === parseInt(this.$route.params.id, 10);
          });

        this.character = clone(routeCharacter);
      },
    },
    watch: {
      hydrated(newVal) {
        if (!this.character && newVal === true) {
          this.loadCharacter();
        }
      },
    },
  };
</script>
