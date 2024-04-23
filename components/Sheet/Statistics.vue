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
        :score="characterAgility"
        helper-text="Sprint, Leap, Maneuver"
        :upgradeable="!character.agility.upgraded"
        modifier
      )
      TraitDisplay(
        title="strength"
        :score="characterStrength"
        helper-text="Lift, Smash, Grapple"
        :upgradeable="!character.strength.upgraded"
        modifier
      )
      TraitDisplay(
        title="finesse"
        :score="characterFinesse"
        helper-text="Control, Hide, Tinker"
        :upgradeable="!character.finesse.upgraded"
        modifier
      )
      TraitDisplay(
        title="instinct"
        :score="characterInstinct"
        helper-text="Perceive, Sense, Navigate"
        :upgradeable="!character.instinct.upgraded"
        modifier
      )
      TraitDisplay(
        title="presence"
        :score="characterPresence"
        helper-text="Charm, Perform, Deceive"
        :upgradeable="!character.presence.upgraded"
        modifier
      )
      TraitDisplay(
        title="knowledge"
        :score="characterKnowledge"
        helper-text="Recall, Analyze, Comprehend"
        :upgradeable="!character.knowledge.upgraded"
        modifier
      )
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';
  import { calculateModifiers } from '~/helpers/character';

  import ARMOR from '~/data/armor';
  import WEAPONS from '~/data/weapons';

  export default {
    name: 'SheetStatistics',
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
      primaryWeapon() {
        return this.character.equipment.primaryWeapon;
      },
      secondaryWeapon() {
        return this.character.equipment.secondaryWeapon;
      },
      armor() {
        return this.character.equipment.armor;
      },
      equipmentFeatures() {
        const features = [];

        if (this.primaryWeapon.feature) {
          const primaryFeature = WEAPONS.features.find(
            (feature) => feature.name === this.primaryWeapon.feature,
          );

          if (primaryFeature) features.push({ ...primaryFeature });
        }

        if (this.secondaryWeapon.secondaryFeature && this.primaryWeapon.burden < 2) {
          const secondaryFeature = WEAPONS.features.find(
            (feature) => feature.name === this.secondaryWeapon.secondaryFeature,
          );

          if (secondaryFeature) features.push({ ...secondaryFeature });
        }

        if (this.armor.feature) {
          const armorFeature = ARMOR.features.find(
            (feature) => feature.name === this.armor.feature,
          );

          if (armorFeature) features.push({ ...armorFeature });
        }

        return features;
      },
      characterEvasion() {
        let score = this.character.evasion;

        // add equipment modifiers
        if (this.equipmentFeatures.length > 0) {
          score += calculateModifiers(this.equipmentFeatures, 'evasion');
        }

        return score;
      },
      characterArmor() {
        let score = 0;

        // add base armor
        if (this.character.equipment.armor) {
          score += this.character.equipment.armor.score;
        }

        // add equipment modifiers
        if (this.equipmentFeatures.length > 0) {
          score += calculateModifiers(this.equipmentFeatures, 'armorScore');
        }

        return score;
      },
      characterAgility() {
        let score = this.character.agility.score;

        // add equipment modifiers
        if (this.equipmentFeatures.length > 0) {
          score += calculateModifiers(this.equipmentFeatures, 'agility');
        }

        return score;
      },
      characterStrength() {
        let score = this.character.strength.score;

        // add equipment modifiers
        if (this.equipmentFeatures.length > 0) {
          score += calculateModifiers(this.equipmentFeatures, 'strength');
        }

        return score;
      },
      characterFinesse() {
        let score = this.character.finesse.score;

        // add equipment modifiers
        if (this.equipmentFeatures.length > 0) {
          score += calculateModifiers(this.equipmentFeatures, 'finesse');
        }

        return score;
      },
      characterInstinct() {
        let score = this.character.instinct.score;

        // add equipment modifiers
        if (this.equipmentFeatures.length > 0) {
          score += calculateModifiers(this.equipmentFeatures, 'instinct');
        }

        return score;
      },
      characterPresence() {
        let score = this.character.presence.score;

        // add equipment modifiers
        if (this.equipmentFeatures.length > 0) {
          score += calculateModifiers(this.equipmentFeatures, 'presence');
        }

        return score;
      },
      characterKnowledge() {
        let score = this.character.knowledge.score;

        // add equipment modifiers
        if (this.equipmentFeatures.length > 0) {
          score += calculateModifiers(this.equipmentFeatures, 'knowledge');
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
