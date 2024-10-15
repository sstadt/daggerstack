<template lang="pug">
  .equipment-picker
    .sticky.p-4.top-0.bg-white.shadow.space-y-1
      h3.text-xl.font-black.uppercase Available Items
      .flex.space-x-6
        InputFilter(
          v-if="!startingOnly"
          v-model="selectedTiers"
          label="tier"
          :options="[1, 2, 3, 4]"
        )
    .divide-y
      button.w-full.text-left.p-4(
        v-for="item in sortedItems"
        class="focus:bg-slate-100"
        @click="selectItem(item)"
      )
        InventoryWeapon(
          v-if="isWeaponType"
          :weapon="item"
          :recommended-trait="bestTrait"
        )
        InventoryArmor(v-else :armor="item")
</template>

<script>
  export default {
    name: 'InventoryEquipmentPicker',
  };
</script>

<script setup>
  import GENERAL from '~/data/general';

  const emit = defineEmits([ 'select' ]);

  const weaponsStore = useWeaponsStore();
  const armorStore = useArmorStore();

  const props = defineProps({
    type: {
      type: String,
      validator(val) {
        return ['weapon', 'armor'].includes(val);
      },
    },
    character: {
      type: Object,
      required: true,
    },
    startingOnly: {
      type: Boolean,
      default: false,
    },
  });

  const selectedTiers = ref([1]);

  if (props.character.level > 4) selectedTiers.value.push(2);
  if (props.character.level > 7) selectedTiers.value.push(3);

  const bestTrait = computed(() => {
    const [ best ] = GENERAL.traits
      .map((trait) => ({ name: trait, score: props.character[trait].score }))
      .sort((a, b) => {
        if (a.score < b.score) return 1;
        if (b.score < a.score) return -1;
        return 0;
      });

    return best.name;
  });

  const isCaster = computed(() => {
    return GENERAL.spellcasters.includes(props.character.baseClass);
  });

  const isWeaponType = computed(() => {
    return props.type === 'weapon';
  });

  const itemList = computed(() => {
    return isWeaponType.value === true ? weaponsStore.weapons : armorStore.armorList;
  });

  const sortedItems = computed(() => {
    const tiers = props.startingOnly ? [1] : selectedTiers.value;

    return itemList.value
      .filter((item) => {
        const matchesTierFilter = tiers.includes(item.tier);
        // TODO: make a "show unavailable" toggle to bypass this
        const matchesMagicFilter = item.damageType !== 'magical' || isCaster.value;

        return matchesTierFilter &&
          matchesMagicFilter;
      })
      .sort((a, b) => {
        if (!a.trait || !b.trait) return 0;

        const aTrait = a.trait.toLowerCase();
        const bTrait = b.trait.toLowerCase();

        if (aTrait === bestTrait.value && bTrait !== bestTrait.value) {
          return -1;
        }

        if (aTrait !== bestTrait.value && bTrait === bestTrait.value) {
          return 1;
        }

        return 0;
      });
  });

  const selectItem = (data) => {
    emit('select', data);
  };
</script>
