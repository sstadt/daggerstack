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
        .relative
          InputCheckboxCounter(
            v-model="currentHealth"
            :max="maxHealth"
            :enabled="healthSlots"
          )
          Transition(name="fade")
            button.absolute.text-2xl.-translate-x-full(
              class="-left-1.5 top-1/2 -translate-y-1/2"
              v-if="outOfHitPoints"
              @click="openDeathMoves"
            )
              span.sr-only Death Moves
              NuxtIcon(name="skull")
      .stress
        h3.text-lg.font-bold.uppercase.w-20.flex-shrink-0(@click="showBonuses('stressSlot')") stress
        InputCheckboxCounter(
          v-model="currentStress"
          :max="maxStress"
          :enabled="stressSlots"
        )
    //- Death Moves
    BasicDrawer(ref="death" title="Death Moves" @close="refresh")
      .divide-y.border-t.border-b
        BasicAccordion(
          id="glory"
          title="Blaze of Glory"
          start-open
          :active-accordion="activeAccordion"
          @open="setActiveAccordion"
        )
          .px-6.py-4.space-y-2
            h2.sr-only Go Out in a Blaze of Glory
            p <strong>Take any action.</strong> It is automatically considered a critical success.
            p <strong>You Die</strong>
        BasicAccordion(
          id="avoid"
          title="Avoid Death"
          :active-accordion="activeAccordion"
          @open="setActiveAccordion"
        )
          .px-6.pt-4.pb-10.space-y-2
            h2.sr-only Avoid Death
            p.uppercase.text-xl.font-bold Drop unconscious and reroll fear die
            p <strong>If it is less than or equal to your level ({{ character.level }})</strong>, take a scar. This will permanently reduce your available hope slots by 1.
            p <strong>You cannot perform any further actions</strong> unless your Hit Points are restored, or you take a long rest.
            p <strong>If you lose access to your last hope slot</strong>, it is time to end you character's journey.
            .flex.justify-between.items-end
              InputText(
                label="Scar Description"
                placeholder="5\" slash over left eye"
                v-model="scarDescription"
              )
              button.u-inline-button.bg-slate-100.px-4(
                type="button"
                :disabled="scarDescription === ''"
                @click="addScar"
              )
                | Apply
                span.sr-only Hope Result
        BasicAccordion(
          id="risk"
          title="Risk it All"
          :active-accordion="activeAccordion"
          @open="setActiveAccordion"
        )
          .px-6.pt-4.pb-2.space-y-2
            h2.sr-only Risk it All
            div
              p.uppercase.text-xl.font-bold Roll Duality dice
              p Then do one of the following...
            .divide-y
              .py-4.space-y-2
                h3.uppercase.font-bold.text-lg Roll With Hope
                p Clear a number of HP or stress slots, in any desired combination, equal to your hope die
                .flex.justify-between
                  InputCounter(
                    label="Hit Points"
                    v-model="hitPointsRefresh"
                    :max="character.health.current"
                  )
                  InputCounter(
                    label="Stress"
                    v-model="stressRefresh"
                    :max="character.stress.current"
                  )
                  button.u-inline-button.bg-slate-100.px-4(
                    type="button"
                    @click="riskHope"
                  )
                    | Apply
                    span.sr-only Hope Result
              .py-4.space-y-2
                h3.uppercase.font-bold.text-lg Roll With Fear
                p You Die
              .flex.justify-between.py-4.items-end
                .space-y-2
                  h3.uppercase.font-bold.text-lg Critical Success
                  p Clear all HP and stress slots
                button.u-inline-button.bg-slate-100.px-4(
                  type="button"
                  @click="riskCrit"
                )
                  | Apply
                  span.sr-only Critical Success
    SheetBonuses(
      ref="bonuses"
      :statistic="selectedTrait"
      :bonuses="selectedBonuses"
    )
</template>

<script>
  export default {
    name: 'SheetHealth',
  };
</script>

<script setup>
  import { useMq } from 'vue3-mq';

  import { useCharactersStore } from '~/stores/characters';

  import GENERAL from '~/data/general';
  import CLASSES from '~/data/classes';
  import { newStatusEffect } from '~/helpers/constructors';

  const charactersStore = useCharactersStore();
  const sheetStore = useSheetStore();

  const mq = useMq();
  const { getFeaturesByAttribute, calculateModifiers } = useSheetBonuses();

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const currentHealth = ref(props.character.health.current);
  const maxHealth = ref(GENERAL.maxHitPoints);
  const currentStress = ref(props.character.stress.current);
  const maxStress = ref(GENERAL.maxStress);
  const selectedTrait = ref('majorDamageThreshold');
  const activeAccordion = ref('glory');
  const scarDescription = ref('');
  const hitPointsRefresh = ref(0);
  const stressRefresh = ref(0);
  const bonuses = ref(null);
  const death = ref(null);

  const baseClass = computed(() => {
    return props.character.baseClass
      ? CLASSES[props.character.baseClass]
      : null;
  });

  const tier1Levels = computed(() => {
    // num levels between 2 and 4
    return Math.max(Math.min(props.character.level - 1, 3), 0);
  });

  const tier2Levels = computed(() => {
    // num levels between 5 and 7
    return Math.max(Math.min(props.character.level - 4, 3), 0);
  });

  const tier3Levels = computed(() => {
    // num levels between 8 and 10
    return Math.max(Math.min(props.character.level - 7, 3), 0);
  });

  const majorDamageThresholdBonuses = computed(() => {
    const thresholdBonuses = getFeaturesByAttribute(props.character, 'majorDamageThreshold');
    const tier1Always = baseClass.value.tier1.always.find((m) => m.increase.majorDamageThreshold);
    const tier1Modifier = tier1Always
      ? tier1Always.increase.majorDamageThreshold * tier1Levels.value
      : 0;
    const tier2Always = baseClass.value.tier2.always.find((m) => m.increase.majorDamageThreshold);
    const tier2Modifier = tier2Always
      ? tier2Always.increase.majorDamageThreshold * tier2Levels.value
      : 0;
    const tier3Always = baseClass.value.tier3.always.find((m) => m.increase.majorDamageThreshold);
    const tier3Modifier = tier3Always
      ? tier3Always.increase.majorDamageThreshold * tier3Levels.value
      : 0;

    if (tier1Modifier > 0) {
      thresholdBonuses.push({
        name: 'Level 2-4 (auto)',
        modify: {
          majorDamageThreshold: tier1Modifier,
        },
      });
    }

    if (tier2Modifier > 0) {
      thresholdBonuses.push({
        name: 'Level 5-7 (auto)',
        modify: {
          majorDamageThreshold: tier2Modifier,
        },
      });
    }

    if (tier3Modifier > 0) {
      thresholdBonuses.push({
        name: 'Level 8-10 (auto)',
        modify: {
          majorDamageThreshold: tier3Modifier,
        },
      });
    }

    return thresholdBonuses;
  });

  const majorThreshold = computed(() => {
    return baseClass.value.startingThreshold.major +
      calculateModifiers(majorDamageThresholdBonuses.value, 'majorDamageThreshold');
  });

  const severeDamageThresholdBonuses = computed(() => {
    const thresholdBonuses = getFeaturesByAttribute(props.character, 'severeDamageThreshold');
    const tier1Always = baseClass.value.tier1.always.find((m) => m.increase.severeDamageThreshold);
    const tier1Modifier = tier1Always
      ? tier1Always.increase.severeDamageThreshold * tier1Levels.value
      : 0;
    const tier2Always = baseClass.value.tier2.always.find((m) => m.increase.severeDamageThreshold);
    const tier2Modifier = tier2Always
      ? tier2Always.increase.severeDamageThreshold * tier2Levels.value
      : 0;
    const tier3Always = baseClass.value.tier3.always.find((m) => m.increase.severeDamageThreshold);
    const tier3Modifier = tier3Always
      ? tier3Always.increase.severeDamageThreshold * tier3Levels.value
      : 0;

    if (tier1Modifier > 0) {
      thresholdBonuses.push({
        name: 'Level 2-4',
        modify: {
          severeDamageThreshold: tier1Modifier,
        },
      });
    }

    if (tier2Modifier > 0) {
      thresholdBonuses.push({
        name: 'Level 5-7',
        modify: {
          severeDamageThreshold: tier2Modifier,
        },
      });
    }

    if (tier3Modifier > 0) {
      thresholdBonuses.push({
        name: 'Level 8-10',
        modify: {
          severeDamageThreshold: tier3Modifier,
        },
      });
    }

    return thresholdBonuses;
  });

  const severeThreshold = computed(() => {
    return baseClass.value.startingThreshold.severe +
      calculateModifiers(severeDamageThresholdBonuses.value, 'severeDamageThreshold');
  });

  const thresholds = computed(() => {
    return [
      { name: 'major', score: majorThreshold.value },
      { name: 'severe', score: severeThreshold.value },
    ];
  });

  const healthSlotBonuses = computed(() => {
    return getFeaturesByAttribute(props.character, 'healthSlot');
  });

  const stressSlotBonuses = computed(() => {
    return getFeaturesByAttribute(props.character, 'stressSlot');
  });

  const healthSlots = computed(() => {
    return props.character.health.slots +
      calculateModifiers(healthSlotBonuses.value, 'healthSlot');
  });

  const stressSlots = computed(() => {
    return props.character.health.slots +
      calculateModifiers(stressSlotBonuses.value, 'stressSlot');
  });

  const outOfHitPoints = computed(() => {
    return props.character.health.current === healthSlots.value;
  });

  const selectedBonuses = computed(() => {
    switch (selectedTrait.value) {
      case 'healthSlot':
        return healthSlotBonuses.value;
      case 'stressSlot':
        return stressSlotBonuses.value;
      default:
        return [];
    }
  });

  const showBonuses = (trait) => {
    selectedTrait.value = trait;
    nextTick(() => {
      bonuses.value.open();
    });
  };

  const openDeathMoves = () => {
    death.value.open();
  };

  const setActiveAccordion = (id) => {
    activeAccordion.value = id;
  };

  const riskHope = () => {
    props.character.health.current = Math.max(0, props.character.health.current - hitPointsRefresh.value);
    props.character.stress.current = Math.max(0, props.character.stress.current - stressRefresh.value);
    charactersStore.saveCharacter(props.character);
    death.value.close();
  };

  const riskCrit = () => {
    props.character.health.current = 0;
    props.character.stress.current = 0;
    charactersStore.saveCharacter(props.character);
    death.value.close();
  };

  const addScar = () => {
    const scar = newStatusEffect({
      name: scarDescription.value,
      enabled: true,
      scar: true,
      modify: {
        hopeSlot: -1,
      },
    });

    props.character.buffs.push(scar);
    charactersStore.saveCharacter(props.character);
    death.value.close();
  };

  const refresh = () => {
    sheetStore.refreshCharacterSheet();
  };

  watch(currentHealth, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      props.character.health.current = newVal;
      charactersStore.saveCharacter(props.character);

      nextTick(() => {
        if (outOfHitPoints.value) {
          openDeathMoves();
        }
      });
    }
  });

  watch(currentStress, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      props.character.stress.current = newVal;
      charactersStore.saveCharacter(props.character);
    }
  });
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
