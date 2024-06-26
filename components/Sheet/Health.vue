<template lang="pug">
  BasicCard.sheet-health(:title="mq.lgPlus ? 'Health' : null")
    .flex.items-center.justify-center.pb-10(class="lg:mt-4")
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
        InputCheckboxCounter(v-model="currentHealth" :max="maxHealth" :enabled="healthSlots")
      .stress
        h3.text-lg.font-bold.uppercase.w-20.flex-shrink-0 stress
        InputCheckboxCounter(v-model="currentStress" :max="maxStress" :enabled="stressSlots")
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';
  import { calculateModifiers, getFeaturesByAttribute } from '~/helpers/character';

  import GENERAL from '~/data/general';
  import CLASSES from '~/data/classes';

  export default {
    name: 'SheetHealth',
    inject: ['mq'],
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
      tier1Levels() {
        // num levels between 2 and 4
        return Math.max(Math.min(this.character.level - 1, 3), 0);
      },
      tier2Levels() {
        // num levels between 5 and 7
        return Math.max(Math.min(this.character.level - 4, 3), 0);
      },
      tier3Levels() {
        // num levels between 8 and 10
        return Math.max(Math.min(this.character.level - 7, 3), 0);
      },
      minorThresholdTierModifiers() {
        const tier1Always = this.baseClass.tier1.always.find((m) => m.increase.minorDamageThreshold);
        const tier1Modifier = tier1Always
          ? tier1Always.increase.minorDamageThreshold * this.tier1Levels
          : 0;
        const tier2Always = this.baseClass.tier2.always.find((m) => m.increase.minorDamageThreshold);
        const tier2Modifier = tier2Always
          ? tier2Always.increase.minorDamageThreshold * this.tier2Levels
          : 0;
        const tier3Always = this.baseClass.tier3.always.find((m) => m.increase.minorDamageThreshold);
        const tier3Modifier = tier3Always
          ? tier3Always.increase.minorDamageThreshold * this.tier3Levels
          : 0;

        return tier1Modifier + tier2Modifier + tier3Modifier;
      },
      majorThresholdTierModifiers() {
        const tier1Always = this.baseClass.tier1.always.find((m) => m.increase.majorDamageThreshold);
        const tier1Modifier = tier1Always
          ? tier1Always.increase.majorDamageThreshold * this.tier1Levels
          : 0;
        const tier2Always = this.baseClass.tier2.always.find((m) => m.increase.majorDamageThreshold);
        const tier2Modifier = tier2Always
          ? tier2Always.increase.majorDamageThreshold * this.tier2Levels
          : 0;
        const tier3Always = this.baseClass.tier3.always.find((m) => m.increase.majorDamageThreshold);
        const tier3Modifier = tier3Always
          ? tier3Always.increase.majorDamageThreshold * this.tier3Levels
          : 0;

        return tier1Modifier + tier2Modifier + tier3Modifier;
      },
      severeThresholdTierModifiers() {
        const tier1Always = this.baseClass.tier1.always.find((m) => m.increase.severeDamageThreshold);
        const tier1Modifier = tier1Always
          ? tier1Always.increase.severeDamageThreshold * this.tier1Levels
          : 0;
        const tier2Always = this.baseClass.tier2.always.find((m) => m.increase.severeDamageThreshold);
        const tier2Modifier = tier2Always
          ? tier2Always.increase.severeDamageThreshold * this.tier2Levels
          : 0;
        const tier3Always = this.baseClass.tier3.always.find((m) => m.increase.severeDamageThreshold);
        const tier3Modifier = tier3Always
          ? tier3Always.increase.severeDamageThreshold * this.tier3Levels
          : 0;

        return tier1Modifier + tier2Modifier + tier3Modifier;
      },
      minorThreshold() {
        const base = this.baseClass.startingThreshold.minor;
        const modifiers = getFeaturesByAttribute(this.character, 'minorDamageThreshold');

        return base + this.minorThresholdTierModifiers + calculateModifiers(modifiers, 'minorDamageThreshold');
      },
      majorThreshold() {
        const base = this.baseClass.startingThreshold.major;
        const modifiers = getFeaturesByAttribute(this.character, 'majorDamageThreshold');

        return base + this.majorThresholdTierModifiers + calculateModifiers(modifiers, 'majorDamageThreshold');
      },
      severeThreshold() {
        const base = this.baseClass.startingThreshold.severe;
        const modifiers = getFeaturesByAttribute(this.character, 'severeDamageThreshold');

        return base + this.severeThresholdTierModifiers + calculateModifiers(modifiers, 'severeDamageThreshold');
      },
      thresholds() {
        return [
          { name: 'minor', score: this.minorThreshold },
          { name: 'major', score: this.majorThreshold },
          { name: 'severe', score: this.severeThreshold },
        ];
      },
      healthSlots() {
        const base = this.character.health.slots;
        const modifiers = getFeaturesByAttribute(this.character, 'healthSlot');

        return base + calculateModifiers(modifiers, 'healthSlot');
      },
      stressSlots() {
        const base = this.character.health.slots;
        const modifiers = getFeaturesByAttribute(this.character, 'stressSlot');

        return base + calculateModifiers(modifiers, 'stressSlot');
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
