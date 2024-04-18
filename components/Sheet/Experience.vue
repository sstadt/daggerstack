<template lang="pug">
  BasicCard(title="Experience")
    .flex.space-x-2.justify-between.text-xl.py-4.border-b(
      v-for="experience in character.experience"
    )
      p {{ experience.name }}
      p +{{ experience.score }}
    InputCheckboxCounter.pt-4(
      label="hope"
      helper-text="Spend hope to use experience or help an ally"
      v-model="hope"
      :max="maxHope"
    )
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';

  export default {
    name: 'SheetExperience',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        hope: this.character.hope,
        maxHope: 5,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    watch: {
      hope(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.character.hope = newVal;
          this.charactersStore.saveCharacter(this.character);
        }
      },
    },
  };
</script>
