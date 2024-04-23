<template lang="pug">
  BasicCard(title="Background Questions")
    .space-y-4
      .space-y-1(v-for="item in background")
        p.font-bold {{ item.question }}
        InputTextarea(v-model="item.answer" @input="saveQuestions")
</template>

<script>
  import { debounce, clone } from '~/helpers/utility';

  import { useCharactersStore } from '~/stores/characters';

  export default {
    name: 'SheetBackground',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        background: clone(this.character.background),
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    methods: {
      saveQuestions: debounce(function () {
        this.character.background = clone(this.background);
        this.charactersStore.saveCharacter(this.character);
      }),
    },
  };
</script>
