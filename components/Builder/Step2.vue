<template lang="pug">
  .max-w-5xl.container.p-8
    form(@submit.prevent="next").space-y-8
      .space-2-y
        h2.text-center.text-2xl.font-black.uppercase Basic Traits
        button.text-center.mb-2.text-sm.text-slate-500(
          type="button"
          @click="setSuggestedTraits"
        ) {{ suggestedTraitsLabel }}
      .grid.grid-cols-3.gap-4
        TraitSelect(
          label="agility"
          :options="agilityOptions"
          v-model="agility"
          :errors="v$.agility.$errors"
          helper-text="Sprint, Leap, Maneuver"
        )
        TraitSelect(
          label="strength"
          :options="strengthOptions"
          v-model="strength"
          :errors="v$.strength.$errors"
          helper-text="Lift, Smash, Grapple"
        )
        TraitSelect(
          label="finesse"
          :options="finesseOptions"
          v-model="finesse"
          :errors="v$.finesse.$errors"
          helper-text="Control, Hide, Tinker"
        )
        TraitSelect(
          label="instinct"
          :options="instinctOptions"
          v-model="instinct"
          :errors="v$.instinct.$errors"
          helper-text="Perceive, Sense, Navigate"
        )
        TraitSelect(
          label="presence"
          :options="presenceOptions"
          v-model="presence"
          :errors="v$.presence.$errors"
          helper-text="Charm, Perform, Deceive"
        )
        TraitSelect(
          label="knowledge"
          :options="knowledgeOptions"
          v-model="knowledge"
          :errors="v$.knowledge.$errors"
          helper-text="Recall, Analyze, Comprehend"
        )
      .space-2-y
        h2.text-center.text-2xl.font-black.uppercase Additional Traits
        .flex.space-x-2.justify-between.text-xl.py-4.border-b
          p Evasion
          p {{ evasion }}
        .flex.space-x-2.justify-between.text-xl.py-4.border-b
          p Damage Threshold
          p {{ threshold.major }} / {{ threshold.severe }}
        .flex.space-x-2.justify-between.text-xl.pt-4
          p Hope
          p 2
      .flex.justify-between.items-center
        NuxtLink(to="/") Finish Later
        BasicButton.block.ml-auto(type="submit") Next
</template>

<script>
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  import classes from '~/data/classes';
  import { mapState } from 'pinia';

  import { excludeArrayItems } from '~/helpers/array';
  import { traitLabel } from '~/helpers/string';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep2',
    data() {
      const {
        agility,
        strength,
        finesse,
        instinct,
        presence,
        knowledge,
      } = this.builderStore.character;

      return {
        initialOptions: [2, 1, 1, 0, 0, -1],
        agility: agility.score,
        strength: strength.score,
        finesse: finesse.score,
        instinct: instinct.score,
        presence: presence.score,
        knowledge: knowledge.score,
      };
    },
    validations() {
      return {
        agility: { required },
        strength: { required },
        finesse: { required },
        instinct: { required },
        presence: { required },
        knowledge: { required },
      };
    },
    setup() {
      const builderStore = useBuilderStore();

      return {
        builderStore,
        v$: useVuelidate(),
      };
    },
    computed: {
      ...mapState(useBuilderStore, ['character']),
      classData() {
        const className = this.character.baseClass;

        return classes[className] || null;
      },
      agilityOptions() {
        const selectedOptions = excludeArrayItems(
          this.getSelectedOptions('agility'),
          this.initialOptions,
        );

        return this.generateTraitOptions(selectedOptions);
      },
      strengthOptions() {
        const selectedOptions = excludeArrayItems(
          this.getSelectedOptions('strength'),
          this.initialOptions,
        );

        return this.generateTraitOptions(selectedOptions);
      },
      finesseOptions() {
        const selectedOptions = excludeArrayItems(
          this.getSelectedOptions('finesse'),
          this.initialOptions,
        );

        return this.generateTraitOptions(selectedOptions);
      },
      instinctOptions() {
        const selectedOptions = excludeArrayItems(
          this.getSelectedOptions('instinct'),
          this.initialOptions,
        );

        return this.generateTraitOptions(selectedOptions);
      },
      presenceOptions() {
        const selectedOptions = excludeArrayItems(
          this.getSelectedOptions('presence'),
          this.initialOptions,
        );

        return this.generateTraitOptions(selectedOptions);
      },
      knowledgeOptions() {
        const selectedOptions = excludeArrayItems(
          this.getSelectedOptions('knowledge'),
          this.initialOptions,
        );

        return this.generateTraitOptions(selectedOptions);
      },
      suggestedTraits() {
        return this.classData ? this.classData.suggestedTraits : [];
      },
      suggestedTraitsLabel() {
        if (!this.classData) return 'Distribute the following scores: +2, +1, +1, 0, 0, -1';

        const suggested = [];

        for (let [key, value] of Object.entries(this.classData.suggestedTraits)) {
          suggested.push(`${traitLabel(value)} ${key}`);
        };
        return `Suggested traits (${this.character.baseClass}): ${suggested.join(', ')}`;
      },
      evasion() {
        return this.classData
          ? this.classData.startingEvasion
          : 0;
      },
      threshold() {
        return this.classData
          ? {
              major: this.classData.startingThreshold.major,
              severe: this.classData.startingThreshold.severe,
            }
          : { major: 0, severe: 0 };
      },
    },
    methods: {
      setSuggestedTraits() {
        this.agility = this.suggestedTraits.agility;
        this.strength = this.suggestedTraits.strength;
        this.finesse = this.suggestedTraits.finesse;
        this.instinct = this.suggestedTraits.instinct;
        this.presence = this.suggestedTraits.presence;
        this.knowledge = this.suggestedTraits.knowledge;
      },
      getSelectedOptions(exclude) {
        const selected = [];

        if (exclude !== 'agility') selected.push(this.agility);
        if (exclude !== 'strength') selected.push(this.strength);
        if (exclude !== 'finesse') selected.push(this.finesse);
        if (exclude !== 'instinct') selected.push(this.instinct);
        if (exclude !== 'presence') selected.push(this.presence);
        if (exclude !== 'knowledge') selected.push(this.knowledge);

        const remaining = structuredClone(selected)
          .filter(item => item !== null)
          .map(item => parseInt(item, 10));

        return Array.isArray(remaining) ? remaining : [remaining];
      },
      generateTraitOptions(options) {
        return options.map((option) => {
          return {
            label: option > -1 ? `+${option}` : `${option}`,
            value: option,
          };
        });
      },
      async next() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          this.builderStore.updateCharacter({
            agility: {
              score: parseInt(this.agility, 10),
              upgraded: false,
            },
            strength: {
              score: parseInt(this.strength, 10),
              upgraded: false,
            },
            finesse: {
              score: parseInt(this.finesse, 10),
              upgraded: false,
            },
            instinct: {
              score: parseInt(this.instinct, 10),
              upgraded: false,
            },
            presence: {
              score: parseInt(this.presence, 10),
              upgraded: false,
            },
            knowledge: {
              score: parseInt(this.knowledge, 10),
              upgraded: false,
            },
            evasion: parseInt(this.evasion, 10),
            threshold: { ...this.threshold },
          });

          this.$emit('next');
        }
      },
    },
  };
</script>
