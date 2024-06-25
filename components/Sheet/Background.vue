<template lang="pug">
  BasicCard(title="Background")
    .space-y-4.pt-4
      .space-y-1(v-for="item in background")
        p {{ item.question }}
        InputTextarea(
          v-model="item.answer"
          label="answer"
          :limit="2000"
          hide-label
          @input="saveQuestions"
        )
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
