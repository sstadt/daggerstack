<template lang="pug">
  .py-3.px-4.border.rounded
    h3.font-bold.text-xl {{ community.name }}
    p.text-slate-600.italic {{ community.description }}
    .mt-2(v-for="feature in community.features")
      p
        strong {{ feature.name }}:
        |  {{ feature.description }}
      ul.flex.space-x-2(
        v-if="feature?.modify && Object.keys(feature?.modify).length > 0"
      )
        li.rounded-2xl.text-xs.bg-slate-200(
          v-for="(mod, key) in feature.modify"
          class="py-1 px-3"
        ) {{ modifierString(mod) }} {{ upgradeStrings[key] }}
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
