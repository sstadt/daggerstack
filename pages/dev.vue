<template lang="pug">
  .max-w-5xl.container.flex.space-x-2.py-6
    .flex-shrink-0(class="w-4/5")
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
</template>

<script>
  // Weapons expect (one per line):
  // Name       | trait   | range | damage | damage type | Burden     | Feature  | Tier
  // Broadsword | Agility | Melee | d8     | (Phy)       | One-Handed | Reliable | 0

  // Armor expects (one per line):
  // Name           | Score | Feature  | Tier
  // Gambeson Armor | 2     | Flexible | 0

  export default {
    name: 'Dev',
    asyncData({ isDev, redirect }) {
      if (!isDev) {
        redirect({ name: '/' });
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
