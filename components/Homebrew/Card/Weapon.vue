<template lang="pug">
  .space-y-2.py-3.px-4.border.rounded
    div
      h3.font-bold.text-xl(:class="titleClass") {{ item.name }}
      p.text-slate-600 {{ item.description }}
    div(v-if="weapon.feature?.name")
      p.font-bold {{ weapon.feature.name }}
      p {{ weapon.feature.description }}
    ul.grid.grid-cols-3(v-if="Object.keys(weapon.feature?.modify).length > 0")
      li(v-for="(mod, key) in item.modify") {{ modifierString(mod) }} {{ upgradeStrings[key] }}
</template>

<script>
  export default {
    name: 'HomebrewCardWeapon',
  };
</script>

<script setup>
  import upgradeStrings from '~/config/upgradeStrings';

  const props = defineProps({
    weapon: {
      type: Object,
      required: true,
    },
  });

  const { useIsHomebrew, useTitleClass, modifierString } = useEquipment();

  const isHomebrew = useIsHomebrew(props.weapon);
  const titleClass = useTitleClass(props.weapon);
</script>
