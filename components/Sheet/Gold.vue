<template lang="pug">
  BasicCard(title="Gold")
    .flex.justify-center
      .mt-6(class="lg:flex max-md:space-y-2")
        .flex.flex-col.items-start.space-x-2
          h3.uppercase.text-sm.font-bold.ml-10 handfuls
          .flex.items-center
            BasicButton.flex.mr-1(
              size="xs"
              :disabled="handful < 1 && bag < 1 && this.chest < 1"
              @click="decrement('handful')"
            )
              NuxtIcon(name="minus")
            InputCheckboxCounter.bg-amber-300.pr-1.flex-nowrap(
              :key="`${key}-handful`"
              v-model="handful"
              :max="maxHandfuls"
              class="py-1.5 pl-1.5"
            )
        .flex.flex-col.items-start.space-x-2
          h3.uppercase.text-sm.font-bold.ml-10 bags
          .flex.items-center
            BasicButton.flex.mr-1(
              size="xs"
              :disabled="bag < 1 && chest < 1"
              @click="decrement('bag')"
            )
              NuxtIcon(name="minus")
            InputCheckboxCounter.bg-amber-400.pr-1.flex-nowrap(
              :key="`${key}-bag`"
              v-model="bag"
              :max="maxBags"
              class="py-1.5 pl-1.5"
            )
        .flex.flex-col.items-start(class="lg:space-x-2")
          h3.uppercase.text-sm.font-bold.ml-10(class="lg:ml-0") chest
          .flex.ml-10
            InputCheckboxCounter.bg-amber-500.pr-01(
              :key="`${key}-chest`"
              v-model="chest"
              :max="maxChests"
              class="py-1.5 pl-1.5"
            )
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';

  import GENERAL from '~/data/general';
  import { debounce, uuidv4 } from '~/helpers/utility';

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
        key: uuidv4(),
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
      decrement(type) {
        if (type === 'handful') {
          if (this.handful > 0) {
            this.handful = this.handful - 1;
          } else if (this.handful < 1 && this.bag > 0) {
            this.bag = this.bag - 1;
            this.handful = this.maxHandfuls - 1;
          } else if (this.handful < 1 && this.bag < 1 && this.chest > 0) {
            this.handful = this.maxHandfuls - 1;
            this.bag = this.maxBags - 1;
            this.chest = this.chest - 1;
          }
        } else if (type === 'bag') {
          if (this.bag > 0) {
            this.bag = this.bag - 1;
          } else if (this.bag < 1 && this.chest > 0) {
            this.chest = this.chest - 1;
            this.bag = this.maxBags - 1;
          }
        }
      },
      updateGold: debounce(function () {
        const gold = {
          handful: this.handful,
          bag: this.bag,
          chest: this.chest,
        };

        this.key = uuidv4();
        this.character.inventory.gold = gold;
        this.charactersStore.saveCharacter(this.character);
      }, 100),
    },
    watch: {
      handful(newVal, oldVal) {
        if (newVal !== oldVal) {
          if (newVal < this.maxHandfuls) {
            this.updateGold();
          } else {
            this.handful = 0;
            this.bag = this.bag + 1;
          }
        }
      },
      bag(newVal, oldVal) {
        if (this.chest < this.maxChests) {
          if (newVal >= this.maxBags && this.chest < this.maxChests) {
            this.bag = 0;
            this.chest = this.chest + 1;
          } else if (newVal !== oldVal) {
            this.updateGold();
          }
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
