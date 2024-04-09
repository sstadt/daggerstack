<template lang="pug">
  .sheet-statistics
    .p-6.pb-0.grid.gap-8.grid-cols-3
      TraitDisplay(
        title="evasion"
        :score="character.evasion"
      )
      TraitDisplay(
        title="armor"
        :score="characterArmor"
      )
      .flex.items-start.justify-center
        .sheet-durability.grid.grid-cols-3.grid-rows-3.gap-1.mt-4
          InputCheckbox(
            v-for="n in maxArmor"
            v-model="currentArmor"
            :value="n"
            :disabled="n > this.character.armor.slots"
          )
      TraitDisplay(
        title="agility"
        :score="character.agility.score"
        helper-text="Sprint, Leap, Maneuver"
        modifier
        upgradeable
      )
      TraitDisplay(
        title="strength"
        :score="character.strength.score"
        helper-text="Lift, Smash, Grapple"
        modifier
        upgradeable
      )
      TraitDisplay(
        title="finesse"
        :score="character.finesse.score"
        helper-text="Control, Hide, Tinker"
        modifier
        upgradeable
      )
      TraitDisplay(
        title="instinct"
        :score="character.instinct.score"
        helper-text="Perceive, Sense, Navigate"
        modifier
        upgradeable
      )
      TraitDisplay(
        title="presence"
        :score="character.presence.score"
        helper-text="Charm, Perform, Deceive"
        modifier
        upgradeable
      )
      TraitDisplay(
        title="knowledge"
        :score="character.knowledge.score"
        helper-text="Recall, Analyze, Comprehend"
        modifier
        upgradeable
      )
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';

  export default {
    name: 'SheetAttributes',
    data() {
      const maxArmor = 9;
      const currentArmor = [];

      for(let i = 0; i < 5; i++) {
        if (i < this.character.armor.current) {
          currentArmor.push(i + 1);
        }
      }

      return {
        currentArmor,
        maxArmor,
      };
    },
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      characterEvasion() {
        // TODO: calculate this with inventory
        return this.character.evasion;
      },
      characterArmor() {
        // TODO: calculate this with inventory
        return 0;
      },
    },
    watch: {
      currentArmor(newVal, oldVal) {
        if (newVal.length !== oldVal.length) {
          this.character.armor.current = newVal.length;
          this.charactersStore.saveCharacter(this.character);
        }
      },
    },
  };
</script>
