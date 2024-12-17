<template lang="pug">
  .py-3.px-4.border.rounded
    h3.font-bold.text-xl {{ ancestry.name }}
    .space-y-2
      p.text-slate-600.italic {{ ancestry.description }}
      .space-y-2(v-for="feature in ancestry.features")
        BasicMarkdown(:source="`**${feature.name}**: ${feature.description}`")
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
    name: 'CardAncestry',
  };
</script>

<script setup>
  import upgradeStrings from '~/config/upgradeStrings';

  const { modifierString } = useEquipment();

  const props = defineProps({
    ancestry: {
      type: Object,
      required: true,
    },
  });
</script>
