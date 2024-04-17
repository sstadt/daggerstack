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
        InputCheckboxCounter.grid.grid-cols-3.grid-rows-3.gap-1.mt-4(
          v-model="currentArmor"
          :max="maxArmor"
          :enabled="character.armor.slots"
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
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        currentArmor: this.character.armor.current,
        maxArmor: 9,
      };
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
        let score = 0;

        if (this.character.equipment.armor) {
          score += this.character.equipment.armor.score;
        }

        return score;
      },
    },
    watch: {
      currentArmor(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.character.armor.current = newVal;
          this.charactersStore.saveCharacter(this.character);
        }
      },
    },
  };
</script>
