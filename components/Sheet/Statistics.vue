<template lang="pug">
  .sheet-statistics
    .p-6.grid.gap-8.grid-cols-3
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
            v-for="n in 9"
            :checked="n <= currentArmor"
            :disabled="n > this.character.armor.slots"
            @change="toggleArmor(n)"
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
        currentArmor: this.character.current,
      };
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
    methods: {
      toggleArmor(n) {
        // TODO: update current armor value
        console.log('>>> toggle armor', n);
      },
    },
  };
</script>
