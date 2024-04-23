<template lang="pug">
  BasicCard(title="Connections")
    .space-y-4
      .space-y-1(v-for="item in connection")
        p.font-bold.mt-4 {{ item.question }}
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
        connection: clone(this.character.connection),
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    methods: {
      saveQuestions: debounce(function () {
        this.character.connection = clone(this.connection);
        this.charactersStore.saveCharacter(this.character);
      }),
    },
  };
</script>
