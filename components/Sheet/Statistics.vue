<template lang="pug">
  .statistics(class="lg:flex lg:justify-between lg:items-center lg:mb-8")
    .px-3.flex.items-center.flex-shrink-0(class="lg:px-0")
      TraitDisplay(
        title="evasion"
        class="w-1/3"
        :score="characterEvasion"
        @click="showBonuses('evasion')"
      )
      .w-px.h-20.mx-2.bg-slate-300(v-if="mq.mdMinus")
      TraitDisplay(
        title="armor"
        class="w-1/3"
        :score="characterArmor"
        @click="showBonuses('armorScore', 'armorSlots')"
      )
      .flex.items-start.justify-center.ml-1(class="lg:ml-2")
        InputCheckboxCounter.grid.grid-cols-3.grid-rows-3.gap-1(
          v-model="currentArmor"
          :max="maxArmor"
          :enabled="armorSlots"
        )
    .h-px.bg-slate-300.mx-auto.mt-5.mb-8(v-if="mq.mdMinus" class="w-4/5")
    .px-6.grid.gap-6.grid-cols-3(
      class="lg:flex lg:space-x-0 lg:mt-8 lg:px-0 lg:scale-90"
    )
      TraitDisplay(
        title="agility"
        :score="characterAgility"
        helper-text="Sprint, Leap, Maneuver"
        :upgraded="character.agility.upgraded"
        modifier
        @click="showBonuses('agility')"
      )
      TraitDisplay(
        title="strength"
        :score="characterStrength"
        helper-text="Lift, Smash, Grapple"
        :upgraded="character.strength.upgraded"
        modifier
        @click="showBonuses('strength')"
      )
      TraitDisplay(
        title="finesse"
        :score="characterFinesse"
        helper-text="Control, Hide, Tinker"
        :upgraded="character.finesse.upgraded"
        modifier
        @click="showBonuses('finesse')"
      )
      TraitDisplay(
        title="instinct"
        :score="characterInstinct"
        helper-text="Perceive, Sense, Navigate"
        :upgraded="character.instinct.upgraded"
        modifier
        @click="showBonuses('instinct')"
      )
      TraitDisplay(
        title="presence"
        :score="characterPresence"
        helper-text="Charm, Perform, Deceive"
        :upgraded="character.presence.upgraded"
        modifier
        @click="showBonuses('presence')"
      )
      TraitDisplay(
        title="knowledge"
        :score="characterKnowledge"
        helper-text="Recall, Analyze, Comprehend"
        :upgraded="character.knowledge.upgraded"
        modifier
        @click="showBonuses('knowledge')"
      )
    SheetBonuses(
      ref="bonuses"
      :statistic="selectedTrait"
      :bonuses="selectedBonuses"
      :secondary-statistic="selectedSecondaryTrait"
      :secondary-bonuses="selectedSecondaryBonuses"
    )
</template>

<script>
  export default {
    name: 'SheetStatistics',
  };
</script>

<script setup>
  import GENERAL from '~/data/general';
  import { useMq } from "vue3-mq";

  const mq = useMq();
  const charactersStore = useCharactersStore();
  const { getFeaturesByAttribute, calculateModifiers } = useSheetBonuses();

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const currentArmor = ref(props.character.armor.current);
  const maxArmor = ref(GENERAL.maxArmorSlots);
  const selectedTrait = ref('agility');
  const selectedSecondaryTrait = ref(null);
  const bonuses = ref(null);

  const armorSlotBonuses = computed(() => {
    return getFeaturesByAttribute(props.character, 'armorSlot');
  });

  const evasionBonuses = computed(() => {
    return getFeaturesByAttribute(props.character, 'evasion');
  });

  const armorScoreBonuses = computed(() => {
    return getFeaturesByAttribute(props.character, 'armorScore');
  });

  const agilityBonuses = computed(() => {
    return getFeaturesByAttribute(props.character, 'agility');
  });

  const strengthBonuses = computed(() => {
    return getFeaturesByAttribute(props.character, 'strength');
  });

  const finesseBonuses = computed(() => {
    return getFeaturesByAttribute(props.character, 'finesse');
  });

  const instinctBonuses = computed(() => {
    return getFeaturesByAttribute(props.character, 'instinct');
  });

  const presenceBonuses = computed(() => {
    return getFeaturesByAttribute(props.character, 'presence');
  });

  const knowledgeBonuses = computed(() => {
    return getFeaturesByAttribute(props.character, 'knowledge');
  });

  const armorSlots = computed(() => {
    return props.character.armor.slots +
      calculateModifiers(armorSlotBonuses.value, 'armorSlot');
  });

  const characterEvasion = computed(() => {
    return props.character.evasion +
      calculateModifiers(evasionBonuses.value, 'evasion');
  });

  const characterArmor = computed(() => {
    return 0 +
      calculateModifiers(armorScoreBonuses.value, 'armorScore');
  });

  const characterAgility = computed(() => {
    return props.character.agility.score +
      calculateModifiers(agilityBonuses.value, 'agility');
  });

  const characterStrength = computed(() => {
    return props.character.strength.score +
      calculateModifiers(strengthBonuses.value, 'strength');
  });

  const characterFinesse = computed(() => {
    return props.character.finesse.score +
      calculateModifiers(finesseBonuses.value, 'finesse');
  });

  const characterInstinct = computed(() => {
    return props.character.instinct.score +
      calculateModifiers(instinctBonuses.value, 'instinct');
  });

  const characterPresence = computed(() => {
    return props.character.presence.score +
      calculateModifiers(presenceBonuses.value, 'presence');
  });

  const characterKnowledge = computed(() => {
    return props.character.knowledge.score +
      calculateModifiers(knowledgeBonuses.value, 'knowledge');
  });

  const selectedBonuses = computed(() => {
    switch (selectedTrait.value) {
      case 'armorSlot':
        return armorSlotBonuses.value;
      case 'evasion':
        return evasionBonuses.value;
      case 'armorScore':
        return armorScoreBonuses.value;
      case 'agility':
        return agilityBonuses.value;
      case 'strength':
        return strengthBonuses.value;
      case 'finesse':
        return finesseBonuses.value;
      case 'instinct':
        return instinctBonuses.value;
      case 'presence':
        return presenceBonuses.value;
      case 'knowledge':
        return knowledgeBonuses.value;
      default:
        return [];
    }
  });

  const selectedSecondaryBonuses = computed(() => {
    return selectedSecondaryTrait.value === 'armorSlot' ? armorSlotBonuses.value : [];
  });

  const showBonuses = (trait) => {
    selectedTrait.value = trait;
    selectedSecondaryTrait.value = trait === 'armorScore' ? 'armorSlot' : null;
    nextTick(() => {
      bonuses.value.open();
    });
  };

  watch(currentArmor, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      props.character.armor.current = newVal;
      charactersStore.saveCharacter(props.character);
    }
  });
</script>
