<template lang="pug">
  .container.px-8.pb-4.space-y-8
    .space-2-y
      h2.text-center.text-2xl.font-black.uppercase Basic Traits
      p.text-center.mb-2.text-sm.text-slate-500
        | Distribute the following scores: +2, +1, +1, 0, 0, -1
    .grid.grid-cols-3.gap-4
      TraitSelect(
        label="agility"
        :options="agilityOptions"
        v-model="agility"
        helper-text="Sprint, Leap, Maneuver"
      )
      TraitSelect(
        label="strength"
        :options="strengthOptions"
        helper-text="Lift, Smash, Grapple"
        v-model="strength"
      )
      TraitSelect(
        label="finesse"
        :options="finesseOptions"
        helper-text="Control, Hide, Tinker"
        v-model="finesse"
      )
      TraitSelect(
        label="instinct"
        :options="instinctOptions"
        helper-text="Perceive, Sense, Navigate"
        v-model="instinct"
      )
      TraitSelect(
        label="presence"
        :options="presenceOptions"
        helper-text="Charm, Perform, Deceive"
        v-model="presence"
      )
      TraitSelect(
        label="knowledge"
        :options="knowledgeOptions"
        helper-text="Recall, Analyze, Comprehend"
        v-model="knowledge"
      )
    .space-2-y
      h2.text-center.text-2xl.font-black.uppercase Additional Traits
      .flex.space-x-2.justify-between.text-xl.py-4.border-b
        p Evasion
        p 6
      .flex.space-x-2.justify-between.text-xl.py-4.border-b
        p Damage Threshold
        p 3 / 7 / 15
      .flex.space-x-2.justify-between.text-xl.pt-4
        p Hope
        p 2
    BasicButton.block.ml-auto(@click="$emit('next')") Next
</template>

<script>
  import { excludeArrayItems } from '~/helpers/array';

  export default {
    name: 'BuilderStep2',
    data() {
      return {
        initialOptions: [2, 1, 1, 0, 0, -1],
        agility: null,
        strength: null,
        finesse: null,
        instinct: null,
        presence: null,
        knowledge: null,
      };
    },
    computed: {
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
    },
    methods: {
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
    },
  };
</script>
