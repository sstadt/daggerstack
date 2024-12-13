<template lang="pug">
  .container.max-w-5xl
    .flex.space-x-2.py-6
      .flex-shrink-0(class="w-4/5")
        h2 Data Parser
        .space-y-2
          InputSelect(v-model="slot" :options="slots" label="slot" required)
          InputCounter(v-model="tier" :min="0" :max="3" label="Tier")
          .flex.space-x-2
            BasicButton(@click="parseWeapons") Parse Weapons
            BasicButton(@click="parseArmor") Parse Armor
          InputTextarea(v-model="input")
      .flex-grow
        BasicButton(@click="copyToClipboard") Copy to Clipboard
        pre {{ output }}
    div
      h2 Random UIds
      .columns-2
        p(v-for="id in ids") {{ id }}
</template>

<script>
  import { uuidv4 } from '~/helpers/utility';
  // Weapons expect (one per line):
  // Name       | trait   | range | damage | damage type | Burden     | Feature
  // Broadsword | Agility | Melee | d8     | (Phy)       | One-Handed | Reliable

  // Armor expects (one per line):
  // Name           | Score | Feature
  // Gambeson Armor | 2     | Flexible

  export default {
    name: 'Dev',
    asyncData({ isDev, redirect }) {
      if (!isDev) {
        redirect('/');
      }
    },
    data() {
      return {
        input: '',
        output: [],
        slot: 'primary',
        slots: [
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
        ],
        tier: 0,
      };
    },
    setup() {
      const toastStore = useToastStore();

      return { toastStore };
    },
    computed: {
      ids() {
        const ids = [];

        for (let i = 0; i < 100; i++) {
          ids.push(uuidv4());
        }

        return ids;
      },
    },
    methods: {
      parseWeapons() {
        this.output = [];

        const output = [];
        const lines = this.input.split('\n');

        lines.forEach((line) => {
          const [
            name,
            trait,
            range,
            damage,
            damageType,
            hands,
            feature,
          ] = line.split(' | ');

          output.push({
            name,
            slot: this.slot,
            trait,
            range,
            damage,
            damageType: damageType.toLowerCase().includes('phy') ? 'physical' : 'magical',
            tier: parseInt(this.tier, 10),
            burden: hands === 'One-Handed' ? 1 : 2,
            feature: feature === '-' ? null : {
              name: feature.toLowerCase(),
              label: feature,
              description: '',
              modify: {},
            },
          });
        });

        this.output = [ ...output ];
      },
      parseArmor() {
        this.output = [];

        const output = [];
        const lines = this.input.split('\n');

        lines.forEach((line) => {
          const [
            name,
            score,
            feature,
          ] = line.split(' | ');

          output.push({
            name,
            score: parseInt(score, 10),
            tier: parseInt(this.tier, 10),
            feature: feature === '-' ? null : {
              name: feature.toLowerCase(),
              label: feature,
              description: '',
              modify: {},
            },
          });
        });

        this.output = [ ...output ];
      },
      copyToClipboard() {
        const text = JSON.stringify(this.output);

        navigator.clipboard.writeText(text);
        this.toastStore.postMessage({ body: 'Copied items to clipboard' });
      },
    },
  };
</script>
