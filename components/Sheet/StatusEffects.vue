<template lang="pug">
  BasicCard
    .space-y-6
      .divide-y
        TransitionGroup(name="slide-fade-right")
          SheetBuff(
            v-for="(buff, index) in buffs"
            :key="buff.id"
            :buff="buff"
            :character="character"
            @remove="removeBuff(index)"
            @save="(updatedBuff) => saveBuff(index, updatedBuff)"
          )
      .flex.justify-end
        BasicButton(priority="secondary" size="sm" @click="addStatusEffect")
          | Add Effect
</template>

<script>
  import { newStatusEffect } from '~/helpers/constructors';

  export default {
    name: 'SheetStatusEffects',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        buffs: [ ...this.character.buffs ],
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    methods: {
      addStatusEffect() {
        this.buffs.push(newStatusEffect());
      },
      removeBuff(index) {
        this.buffs.splice(index, 1);

        this.saveStatusEffects();
      },
      saveBuff(index, buff) {
        this.buffs.splice(index, 1, buff);

        this.saveStatusEffects();
      },
      saveStatusEffects() {
        this.character.buffs = [ ...this.buffs ];
        this.charactersStore.saveCharacter(this.character);
      },
    },
  };
</script>
