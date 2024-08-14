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
      .flex.items-start.justify-center.ml-1(class="md:ml-4 lg:ml-2")
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
  import { useCharactersStore } from '~/stores/characters';
  import { calculateModifiers, getFeaturesByAttribute } from '~/helpers/character';

  import GENERAL from '~/data/general';

  export default {
    name: 'SheetStatistics',
    inject: ['mq'],
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        currentArmor: this.character.armor.current,
        maxArmor: GENERAL.maxArmorSlots,
        selectedTrait: 'agility',
        selectedSecondaryTrait: null,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      armorSlotBonuses() {
        return getFeaturesByAttribute(this.character, 'armorSlot');
      },
      armorSlots() {
        return this.character.armor.slots +
          calculateModifiers(this.armorSlotBonuses, 'armorSlot');
      },
      evasionBonuses() {
        return getFeaturesByAttribute(this.character, 'evasion');
      },
      characterEvasion() {
        return this.character.evasion +
          calculateModifiers(this.evasionBonuses, 'evasion');
      },
      armorScoreBonuses() {
        return getFeaturesByAttribute(this.character, 'armorScore');
      },
      characterArmor() {
        return 0 +
          calculateModifiers(this.armorScoreBonuses, 'armorScore');
      },
      agilityBonuses() {
        return getFeaturesByAttribute(this.character, 'agility');
      },
      characterAgility() {
        return this.character.agility.score +
          calculateModifiers(this.agilityBonuses, 'agility');
      },
      strengthBonuses() {
        return getFeaturesByAttribute(this.character, 'strength');
      },
      characterStrength() {
        return this.character.strength.score +
          calculateModifiers(this.strengthBonuses, 'strength');
      },
      finesseBonuses() {
        return getFeaturesByAttribute(this.character, 'finesse');
      },
      characterFinesse() {
        return this.character.finesse.score +
          calculateModifiers(this.finesseBonuses, 'finesse');
      },
      instinctBonuses() {
        return getFeaturesByAttribute(this.character, 'instinct');
      },
      characterInstinct() {
        return this.character.instinct.score +
          calculateModifiers(this.instinctBonuses, 'instinct');
      },
      presenceBonuses() {
        return getFeaturesByAttribute(this.character, 'presence');
      },
      characterPresence() {
        return this.character.presence.score +
          calculateModifiers(this.presenceBonuses, 'presence');
      },
      knowledgeBonuses() {
        return getFeaturesByAttribute(this.character, 'knowledge');
      },
      characterKnowledge() {
        return this.character.knowledge.score +
          calculateModifiers(this.knowledgeBonuses, 'knowledge');
      },
      selectedBonuses() {
        return this[`${this.selectedTrait}Bonuses`];
      },
      selectedSecondaryBonuses() {
        return this[`${this.selectedSecondaryTrait}Bonuses`] || [];
      },
    },
    methods: {
      showBonuses(trait) {
        this.selectedTrait = trait;
        this.selectedSecondaryTrait = trait === 'armorScore' ? 'armorSlot' : null;
        this.$nextTick(() => {
          this.$refs.bonuses.open();
        });
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
