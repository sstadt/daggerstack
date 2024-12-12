<template lang="pug">
  .space-y-2.py-3.px-4.border.rounded
    .relative.pr-10
      h3.font-bold.text-xl(:class="titleClass") {{ armor.name }}
      p.u-bg-armor.absolute.-right-2.w-10.text-center(
        class="top-1/2 -translate-y-1/2 py-3.5"
      ) {{ armor.score }}
    div(v-if="armor.feature?.name")
      p.font-bold {{ armor.feature.name }}
      p {{ armor.feature.description }}
    ul.grid.grid-cols-3(v-if="armor.feature?.modify && Object.keys(armor.feature?.modify).length > 0")
      li(v-for="(mod, key) in armor.feature.modify") {{ modifierString(mod) }} {{ upgradeStrings[key] }}
</template>

<script>
  export default {
    name: 'HomebrewCardArmor',
  };
</script>

<script setup>
  import upgradeStrings from '~/config/upgradeStrings';
  import { titleCase } from '~/helpers/string';

  const props = defineProps({
    armor: {
      type: Object,
      required: true,
    },
  });

  const { useIsHomebrew, useTitleClass, modifierString } = useEquipment();

  const isHomebrew = useIsHomebrew(props.armor);
  const titleClass = useTitleClass(props.armor);
</script>
