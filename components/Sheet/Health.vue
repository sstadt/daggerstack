<template lang="pug">
  BasicCard.sheet-health(title="Hit Points & Stress")
    .grid.grid-cols-3.gap-4.p-5
      TraitDisplay(title="minor" :score="minorThreshold")
      TraitDisplay(title="major" :score="majorThreshold")
      TraitDisplay(title="severe" :score="severeThreshold")
    .space-y-6
      .hit-points
        h3.text-lg.font-bold.uppercase.w-20.flex-shrink-0 HP
        InputCheckboxCounter(
          v-model="currentHealth"
          :max="maxHealth"
          :enabled="character.health.slots"
        )
      .stress
        h3.text-lg.font-bold.uppercase.w-20.flex-shrink-0 stress
        InputCheckboxCounter(
          v-model="currentStress"
          :max="maxStress"
          :enabled="character.stress.slots"
        )
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';

  import classes from '~/data/classes';

  export default {
    name: 'SheetHealth',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        currentHealth: this.character.health.current,
        maxHealth: 12,
        currentStress: this.character.stress.current,
        maxStress: 9,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      baseClass() {
        return this.character.baseClass
          ? classes[this.character.baseClass]
          : null;
      },
      minorThreshold() {
        let threshold = 0;

        if (this.baseClass) {
          threshold += this.baseClass.startingThreshold.minor;
        }

        // TODO: include leveling/subclass bonuses

        return threshold;
      },
      majorThreshold() {
        let threshold = 0;

        if (this.baseClass) {
          threshold += this.baseClass.startingThreshold.major;
        }

        // TODO: include leveling/subclass bonuses

        return threshold;
      },
      severeThreshold() {
        let threshold = 0;

        if (this.baseClass) {
          threshold += this.baseClass.startingThreshold.severe;
        }

        // TODO: include leveling/subclass bonuses

        return threshold;
      },
    },
    watch: {
      currentHealth(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.character.health.current = newVal;
          this.charactersStore.saveCharacter(this.character);
        }
      },
      currentStress(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.character.stress.current = newVal;
          this.charactersStore.saveCharacter(this.character);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .threshold-icon {
    transform: translateY(1px);

    &:deep(svg) {
      height: 12px;
      width: 12px;
    }
  }
</style>
