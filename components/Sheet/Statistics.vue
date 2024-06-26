<template lang="pug">
  .statistics(class="lg:flex lg:justify-between lg:items-center lg:mb-8")
    .px-3.flex.items-center.flex-shrink-0(class="lg:px-0")
      TraitDisplay(
        title="evasion"
        class="w-1/3"
        :score="characterEvasion"
      )
      .w-px.h-20.mx-2.bg-slate-300(v-if="mq.mdMinus")
      TraitDisplay(
        title="armor"
        class="w-1/3"
        :score="characterArmor"
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
      )
      TraitDisplay(
        title="strength"
        :score="characterStrength"
        helper-text="Lift, Smash, Grapple"
        :upgraded="character.strength.upgraded"
        modifier
      )
      TraitDisplay(
        title="finesse"
        :score="characterFinesse"
        helper-text="Control, Hide, Tinker"
        :upgraded="character.finesse.upgraded"
        modifier
      )
      TraitDisplay(
        title="instinct"
        :score="characterInstinct"
        helper-text="Perceive, Sense, Navigate"
        :upgraded="character.instinct.upgraded"
        modifier
      )
      TraitDisplay(
        title="presence"
        :score="characterPresence"
        helper-text="Charm, Perform, Deceive"
        :upgraded="character.presence.upgraded"
        modifier
      )
      TraitDisplay(
        title="knowledge"
        :score="characterKnowledge"
        helper-text="Recall, Analyze, Comprehend"
        :upgraded="character.knowledge.upgraded"
        modifier
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
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      armorSlots() {
        const base = this.character.armor.slots;
        const modifiers = getFeaturesByAttribute(this.character, 'armorSlot');

        return base + calculateModifiers(modifiers, 'armorSlot');
      },
      characterEvasion() {
        const base = this.character.evasion;
        const modifiers = getFeaturesByAttribute(this.character, 'evasion');

        return base + calculateModifiers(modifiers, 'evasion');
      },
      characterArmor() {
        const base = 0;
        const features = getFeaturesByAttribute(this.character, 'armorScore');

        return base + calculateModifiers(features, 'armorScore');
      },
      characterAgility() {
        const base = this.character.agility.score;
        const features = getFeaturesByAttribute(this.character, 'agility');

        return base + calculateModifiers(features, 'agility');
      },
      characterStrength() {
        const base = this.character.strength.score;
        const features = getFeaturesByAttribute(this.character, 'strength');

        return base + calculateModifiers(features, 'strength');
      },
      characterFinesse() {
        const base = this.character.finesse.score;
        const features = getFeaturesByAttribute(this.character, 'finesse');

        return base + calculateModifiers(features, 'finesse');
      },
      characterInstinct() {
        const base = this.character.instinct.score;
        const features = getFeaturesByAttribute(this.character, 'instinct');

        return base + calculateModifiers(features, 'instinct');
      },
      characterPresence() {
        const base = this.character.presence.score;
        const features = getFeaturesByAttribute(this.character, 'presence');

        return base + calculateModifiers(features, 'presence');
      },
      characterKnowledge() {
        const base = this.character.knowledge.score;
        const features = getFeaturesByAttribute(this.character, 'knowledge');

        return base + calculateModifiers(features, 'knowledge');
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
