<template lang="pug">
  .space-y-2.py-3.px-4.border.rounded
    h3.font-bold.text-xl(:class="titleClass") {{ community.name }}
    p {{ community.description }}
    div(v-for="feature in community.features")
      p.font-bold {{ feature.name }}
      p {{ feature.description }}
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

  const props = defineProps({
    community: {
      type: Object,
      required: true,
    },
  });
</script>
