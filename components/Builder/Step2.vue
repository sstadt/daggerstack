<template lang="pug">
  .container.p-8.space-y-8
    .space-2-y
      h2.text-center.text-2xl.font-black.uppercase Traits
      p.text-center.mb-2.text-sm.text-slate-500
        | Distribute the following scores: +2, +1, +1, 0, 0, -1
    .grid.grid-cols-3.gap-4
      TraitSelect(label="agility" :options="agilityOptions" v-model="agility")
      TraitSelect(label="strength" :options="strengthOptions" v-model="strength")
      TraitSelect(label="finesse" :options="finesseOptions" v-model="finesse")
      TraitSelect(label="instinct" :options="instinctOptions" v-model="instinct")
      TraitSelect(label="presence" :options="presenceOptions" v-model="presence")
      TraitSelect(label="knowledge" :options="knowledgeOptions" v-model="knowledge")
    BasicButton(@click="$emit('next')") Next
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
