<template lang="pug">
  BasicCard(title="Gold")
    .grid.grid-cols-2.gap-2.items-center.mt-4
      h3.uppercase.text-sm.text-center.font-bold.text-right handfuls
      .flex
        InputCheckboxCounter.bg-slate-300.p-1.pr-0(
          v-model="handful"
          :max="maxHandfuls"
        )
      h3.uppercase.text-sm.text-center.font-bold.text-right bag
      .flex
        InputCheckboxCounter.bg-slate-400.p-1.pr-0(
          v-model="bag"
          :max="maxBags"
        )
      h3.uppercase.text-sm.text-center.font-bold.text-right chests
      .flex
        InputCheckboxCounter.bg-slate-500.p-1.pr-0(
          v-model="chest"
          :max="maxChests"
        )
      h3.uppercase.text-sm.text-center.font-bold.text-right hoards
      .flex
        InputCheckboxCounter.bg-slate-600.p-1.pr-0(
          v-model="hoard"
          :max="maxHoards"
        )
      h3.uppercase.text-sm.text-center.font-bold.text-right fortune
      .flex
        InputCheckboxCounter.bg-slate-700.p-1.pr-0(
          v-model="fortune"
          :max="maxFortunes"
        )
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';

  export default {
    name: 'SheetGold',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        handful: this.character.inventory.gold.handful,
        maxHandfuls: 5,
        bag: this.character.inventory.gold.bag,
        maxBags: 4,
        chest: this.character.inventory.gold.chest,
        maxChests: 3,
        hoard: this.character.inventory.gold.hoard,
        maxHoards: 2,
        fortune: this.character.inventory.gold.fortune,
        maxFortunes: 1,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    methods: {
      updateGold() {
        const gold = {
          handful: this.handful,
          bag: this.bag,
          chest: this.chest,
          hoard: this.hoard,
          fortune: this.fortune,
        };

        this.character.inventory.gold = gold;
        this.charactersStore.saveCharacter(this.character);
      },
    },
    watch: {
      handful(newVal, oldVal) {
        if (newVal !== oldVal && newVal <= this.maxHandfuls) {
          this.updateGold();
        }
      },
      bag(newVal, oldVal) {
        if (newVal !== oldVal && newVal <= this.maxBags) {
          this.updateGold();
        }
      },
      chest(newVal, oldVal) {
        if (newVal !== oldVal && newVal <= this.maxChests) {
          this.updateGold();
        }
      },
      hoard(newVal, oldVal) {
        if (newVal !== oldVal && newVal <= this.maxHoards) {
          this.updateGold();
        }
      },
      fortune(newVal, oldVal) {
        if (newVal !== oldVal && newVal <= this.maxFortunes) {
          this.updateGold();
        }
      },
    },
  };
</script>
