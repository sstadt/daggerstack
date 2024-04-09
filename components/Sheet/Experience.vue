<template lang="pug">
  BasicCard(title="Experience")
    .flex.space-x-2.justify-between.text-xl.py-4.border-b(
      v-for="experience in character.experience"
    )
      p {{ experience.name }}
      p +{{ experience.score }}
    .hit-points.flex.items-center.pt-4.flex-wrap
      h3.text-lg.font-bold.uppercase.w-20 hope
      InputCheckbox(
        v-for="n in maxHope"
        v-model="hope"
        :value="n"
      )
      p.text-xs.text-slate-500.ml-auto.w-full Spend hope to use experience or help an ally
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';

  export default {
    name: 'SheetExperience',
    data() {
      const hope = [];

      for(let i = 0; i < 5; i++) {
        if (i < this.character.hope) {
          hope.push(i + 1);
        }
      }

      return {
        hope,
        maxHope: 5,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    watch: {
      hope(newVal, oldVal) {
        if (newVal.length !== oldVal.length) {
          this.character.hope = newVal.length;
          this.charactersStore.saveCharacter(this.character);
        }
      },
    },
  };
</script>
