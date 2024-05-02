<template lang="pug">
  BasicCard(title="Description")
    InputTextarea.mt-8(
      v-model="description"
      label="Description"
      @input="saveDescription"
      hide-label
    )
</template>

<script>
  import { debounce } from '~/helpers/utility';

  import { useCharactersStore } from '~/stores/characters';

  export default {
    name: 'SheetAppearance',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        description: this.character.description,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    methods: {
      saveDescription: debounce(function () {
        this.character.description = this.description;
        this.charactersStore.saveCharacter(this.character);
      }),
    },
  };
</script>
