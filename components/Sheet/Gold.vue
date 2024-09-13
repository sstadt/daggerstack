<template lang="pug">
  BasicCard(title="Gold")
    .flex.justify-center
      .mt-6(class="lg:flex max-md:space-y-2")
        .flex.flex-col.items-start.space-x-2
          h3.uppercase.text-sm.font-bold.ml-10 handfuls
          .flex.items-center
            BasicButton.flex.mr-1(
              size="xs"
              :disabled="character.inventory.gold < 1"
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
              :disabled="character.inventory.gold < handfulsPerBag"
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
  export default {
    name: 'SheetGold',
  };
</script>

<script setup>
  import GENERAL from '~/data/general';
  import { debounce, uuidv4 } from '~/helpers/utility';

  const charactersStore = useCharactersStore();

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const key = ref(uuidv4());
  const handful = ref(0);
  const bag = ref(0);
  const chest = ref(0);
  const maxHandfuls = ref(GENERAL.gold.maxHandfuls);
  const maxBags = ref(GENERAL.gold.maxBags);
  const maxChests = ref(GENERAL.gold.maxChests);
  const handfulsPerBag = ref(GENERAL.gold.handfulsPerBag);
  const refreshing = ref(false);

  onMounted(() => {
    refreshGold();
  });

  const decrement = (type) => {
    const handfuls = type === 'handful' ? 1 : GENERAL.gold.handfulsPerBag;
    props.character.inventory.gold = Math.max(props.character.inventory.gold - handfuls, 0);

    key.value = uuidv4();
    refreshGold();
    charactersStore.saveCharacter(props.character);
  };

  const refreshGold = () => {
    const handfulsPerBag = GENERAL.gold.handfulsPerBag;
    const handfulsPerChest = GENERAL.gold.handfulsPerBag * GENERAL.gold.bagsPerChest;

    refreshing.value = true;

    nextTick(() => {
      chest.value = Math.max(Math.floor(props.character.inventory.gold / handfulsPerChest), 0);
      bag.value = Math.max(
        Math.floor((props.character.inventory.gold - (chest.value * handfulsPerChest)) / handfulsPerBag),
        0,
      );
      handful.value = Math.max(
        (props.character.inventory.gold - ((chest.value * handfulsPerChest) + (bag.value * handfulsPerBag))),
        0,
      );

      nextTick(() => {
        key.value = uuidv4();
        refreshing.value = false;
      });
    });
  };

  const saveGold = debounce(function () {
    const gold = handful.value +
      (bag.value * GENERAL.gold.handfulsPerBag) +
      (chest.value * GENERAL.gold.bagsPerChest * GENERAL.gold.handfulsPerBag);

    props.character.inventory.gold = gold;

    // compact gold if we have reached max on handfuls or bags
    if (handful.value === maxHandfuls.value || bag.value === maxBags.value) {
      refreshGold();
    }

    charactersStore.saveCharacter(props.character);
  }, 100);

  watch(handful, (newVal, oldVal) => {
    if (
      !refreshing.value &&
      newVal !== oldVal &&
      newVal >= 0 &&
      newVal <= GENERAL.gold.maxHandfuls
    ) {
      saveGold();
    }
  });

  watch(bag, (newVal, oldVal) => {
    if (
      !refreshing.value &&
      newVal !== oldVal &&
      newVal >= 0 &&
      newVal <= GENERAL.gold.maxBags
    ) {
      saveGold();
    }
  });

  watch(chest, (newVal, oldVal) => {
    if (
      !refreshing.value &&
      newVal !== oldVal &&
      newVal >= 0 &&
      newVal <= GENERAL.gold.maxChests
    ) {
      saveGold();
    }
  });
</script>
