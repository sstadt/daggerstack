<template lang="pug">
  BasicCard(title="Gold")
    .space-y-2.mt-6
      .flex.space-x-2.items-center
        h3.uppercase.text-sm.text-center.font-bold.text-right.w-20 handfuls
        .flex
          InputCheckboxCounter.bg-amber-300.p-1.pr-0(
            v-model="handful"
            :max="maxHandfuls"
          )
      .flex.space-x-2.items-center
        h3.uppercase.text-sm.text-center.font-bold.text-right.w-20 bags
        .flex
          InputCheckboxCounter.bg-amber-400.p-1.pr-0(
            v-model="bag"
            :max="maxBags"
          )
      .flex.space-x-2.items-center
        h3.uppercase.text-sm.text-center.font-bold.text-right.w-20 chest
        .flex
          InputCheckboxCounter.bg-amber-500.p-1.pr-0(
            v-model="chest"
            :max="maxChests"
          )
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';

  import GENERAL from '~/data/general';

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
        maxHandfuls: GENERAL.gold.maxHandfuls,
        bag: this.character.inventory.gold.bag,
        maxBags: GENERAL.gold.maxBags,
        chest: this.character.inventory.gold.chest,
        maxChests: GENERAL.gold.maxChests,
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
    },
  };
</script>
