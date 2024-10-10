<template lang="pug">
  .space-y-2.py-3.px-4.border.rounded
    .flex.justify-between.items-center
      h3.font-bold.text-xl(:class="titleClass") {{ weapon.name }}
      .flex
        NuxtIcon(v-if="showMainHand" name="left-hand")
        NuxtIcon(v-if="showOffHand" name="right-hand")
    .flex.justify-between
      p {{ titleCase(weapon.trait) }} {{ weapon.range }}
      p {{ weapon.damage }} ({{ weapon.damageType.toLowerCase().slice(0, 3) }})
    div(v-if="weapon.feature?.name")
      p.font-bold {{ weapon.feature.name }}
      p {{ weapon.feature.description }}
    ul.grid.grid-cols-3(v-if="weapon.feature?.modify && Object.keys(weapon.feature?.modify).length > 0")
      li(v-for="(mod, key) in weapon.feature.modify") {{ modifierString(mod) }} {{ upgradeStrings[key] }}
</template>

<script>
  export default {
    name: 'HomebrewCardWeapon',
  };
</script>

<script setup>
  import upgradeStrings from '~/config/upgradeStrings';
  import { titleCase } from '~/helpers/string';


  const { useShowMainHand, useShowOffHand } = useWeapon();

  const props = defineProps({
    weapon: {
      type: Object,
      required: true,
    },
  });

  const { useIsHomebrew, useTitleClass, modifierString } = useEquipment();

  const isHomebrew = useIsHomebrew(props.weapon);
  const titleClass = useTitleClass(props.weapon);
  const showMainHand = useShowMainHand(props.weapon);
  const showOffHand = useShowOffHand(props.weapon);
</script>
