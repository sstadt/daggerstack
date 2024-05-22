<template lang="pug">
  BasicCard.sheet-health
    .flex.items-center.justify-center.pb-10
      template(v-for="(threshold, index) in thresholds")
        p.relative.border.border-black.rounded.text-lg.py-1.pr-1.w-12.text-center
          | {{ threshold.score }}
          span.threshold__helper-text.absolute.text-slate-500.text-xs.whitespace-nowrap
            | {{ index + 1 }} HP
        p.threshold-name.relative.py-1.text-xs.text-white.bg-black.uppercase.font-bold(class="pr-1.5")
          | {{ threshold.name }}
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
  import { calculateModifiers, getFeaturesByAttribute } from '~/helpers/character';

  import GENERAL from '~/data/general';
  import CLASSES from '~/data/classes';

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
        maxHealth: GENERAL.maxHitPoints,
        currentStress: this.character.stress.current,
        maxStress: GENERAL.maxStress,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      baseClass() {
        return this.character.baseClass
          ? CLASSES[this.character.baseClass]
          : null;
      },
      minorThreshold() {
        const base = this.baseClass.startingThreshold.minor;
        const modifiers = getFeaturesByAttribute(this.character, 'minorDamageThreshold');

        return base + calculateModifiers(modifiers, 'minorDamageThreshold');
      },
      majorThreshold() {
        const base = this.baseClass.startingThreshold.major;
        const modifiers = getFeaturesByAttribute(this.character, 'majorDamageThreshold');

        return base + calculateModifiers(modifiers, 'majorDamageThreshold');
      },
      severeThreshold() {
        const base = this.baseClass.startingThreshold.severe;
        const modifiers = getFeaturesByAttribute(this.character, 'severeDamageThreshold');

        return base + calculateModifiers(modifiers, 'severeDamageThreshold');
      },
      thresholds() {
        return [
          { name: 'minor', score: this.minorThreshold },
          { name: 'major', score: this.majorThreshold },
          { name: 'severe', score: this.severeThreshold },
        ];
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
  .threshold-name::after {
    content: "";
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(-100%, -50%);
    display: block;
    width: 0;
    height: 0;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-right: 12px solid black;
  }

  .threshold__helper-text {
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
