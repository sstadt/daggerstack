<template lang="pug">
  .py-3.px-4.border.rounded
    h3.font-bold.text-xl {{ community.name }}
    p.text-slate-600.italic {{ community.description }}
    .mt-2(v-for="feature in community.features")
      p
        strong {{ feature.name }}:
        |  {{ feature.description }}
      ul.grid.grid-cols-3(v-if="feature?.modify && Object.keys(feature?.modify).length > 0")
        li(v-for="(mod, key) in feature.modify") {{ modifierString(mod) }} {{ upgradeStrings[key] }}
</template>

<script>
  export default {
    name: 'HomebrewCardCommunity',
  };
</script>

<script setup>
  import upgradeStrings from '~/config/upgradeStrings';

  const { modifierString } = useEquipment();

  const props = defineProps({
    community: {
      type: Object,
      required: true,
    },
  });
</script>
