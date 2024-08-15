<template lang="pug">
  BasicCard.sheet-health(title="Health")
    .flex.flex-col.items-center.space-y-6.mt-8
      .flex.items-center.justify-center.pb-2(class="lg:mt-4")
        .flex.flex-col.justify-center
          p.px-4.py-3.text-sm.bg-black.font-bold.text-white.text-center.rounded.relative
            span.uppercase Minor
            span.threshold__helper-text.text-slate-500.text-xs.whitespace-nowrap.text-center.absolute(
              class="-translate-x-1/2 translate-y-full bottom-0 left-1/2"
            ) Mark 1 HP
        template(v-for="(threshold, index) in thresholds")
          button.threshold-value.relative.border-y.border-black.text-lg.text-center(
            class="px-2.5"
            @click="showBonuses(`${threshold.name}DamageThreshold`)"
          ) {{ threshold.score }}
          .flex.flex-col.justify-center
            p.pr-4.py-3.pl-6.text-sm.bg-black.font-bold.text-white.text-center.rounded.relative
              span.uppercase {{ threshold.name }}
              span.threshold__helper-text.text-slate-500.text-xs.whitespace-nowrap.text-center.absolute(
                class="-translate-x-1/2 translate-y-full bottom-0 left-1/2"
              ) Mark {{ index + 2 }} HP
      .hit-points
        h3.text-lg.font-bold.uppercase.w-20.flex-shrink-0(@click="showBonuses('healthSlot')") HP
        InputCheckboxCounter(v-model="currentHealth" :max="maxHealth" :enabled="healthSlots")
      .stress
        h3.text-lg.font-bold.uppercase.w-20.flex-shrink-0(@click="showBonuses('stressSlot')") stress
        InputCheckboxCounter(v-model="currentStress" :max="maxStress" :enabled="stressSlots")
    SheetBonuses(
      ref="bonuses"
      :statistic="selectedTrait"
      :bonuses="selectedBonuses"
    )
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
        selectedTrait: 'majorDamageThreshold',
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
      majorDamageThresholdBonuses() {
        const bonuses = getFeaturesByAttribute(this.character, 'majorDamageThreshold');
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

        if (tier1Modifier > 0) {
          bonuses.push({
            name: 'Level 2-4 (auto)',
            modify: {
              majorDamageThreshold: tier1Modifier,
            },
          });
        }

        if (tier2Modifier > 0) {
          bonuses.push({
            name: 'Level 5-7 (auto)',
            modify: {
              majorDamageThreshold: tier2Modifier,
            },
          });
        }

        if (tier3Modifier > 0) {
          bonuses.push({
            name: 'Level 8-10 (auto)',
            modify: {
              majorDamageThreshold: tier3Modifier,
            },
          });
        }

        return bonuses;
      },
      majorThreshold() {
        return this.baseClass.startingThreshold.major +
          calculateModifiers(this.majorDamageThresholdBonuses, 'majorDamageThreshold');
      },
      severeDamageThresholdBonuses() {
        const bonuses = getFeaturesByAttribute(this.character, 'severeDamageThreshold');
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

        if (tier1Modifier > 0) {
          bonuses.push({
            name: 'Level 2-4',
            modify: {
              severeDamageThreshold: tier1Modifier,
            },
          });
        }

        if (tier2Modifier > 0) {
          bonuses.push({
            name: 'Level 5-7',
            modify: {
              severeDamageThreshold: tier2Modifier,
            },
          });
        }

        if (tier3Modifier > 0) {
          bonuses.push({
            name: 'Level 8-10',
            modify: {
              severeDamageThreshold: tier3Modifier,
            },
          });
        }

        return bonuses;
      },
      severeThreshold() {
        return this.baseClass.startingThreshold.severe +
          calculateModifiers(this.severeDamageThresholdBonuses, 'severeDamageThreshold');
      },
      thresholds() {
        return [
          { name: 'major', score: this.majorThreshold },
          { name: 'severe', score: this.severeThreshold },
        ];
      },
      healthSlotBonuses() {
        return getFeaturesByAttribute(this.character, 'healthSlot');
      },
      healthSlots() {
        return this.character.health.slots +
          calculateModifiers(this.healthSlotBonuses, 'healthSlot');
      },
      stressSlotBonuses() {
        return getFeaturesByAttribute(this.character, 'stressSlot');
      },
      stressSlots() {
        return this.character.health.slots +
          calculateModifiers(this.stressSlotBonuses, 'stressSlot');
      },
      selectedBonuses() {
        return this.selectedTrait
          ? this[`${this.selectedTrait}Bonuses`]
          : [];
      },
    },
    methods: {
      showBonuses(trait) {
        this.selectedTrait = trait;
        this.$nextTick(() => {
          this.$refs.bonuses.open();
        });
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
  .threshold-value::after {
    content: "";
    pointer-events: none;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    display: block;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid black;
    z-index: 2;
  }

  .threshold-value::before {
    content: "";
    pointer-events: none;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    display: block;
    width: 0;
    height: 0;
    border-top: 14px solid transparent;
    border-bottom: 14px solid transparent;
    border-left: 14px solid white;
    z-index: 1;
  }
</style>
