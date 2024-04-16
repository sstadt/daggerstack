<template lang="pug">
  .w-full
    .flex.space-x-2.justify-between
      h3.text-lg.font-bold.truncate {{ armor.name }}
      p.text-lg {{ armor.score }}
    p.text-sm.text-slate-600(v-if="armor.feature")
      span.font-bold.mr-1 {{ titleCase(armor.feature) }}
      span.italic(v-if="featureDescription") {{ featureDescription }}
</template>

<script>
  import { titleCase, modifierString } from '~/helpers/string';

  import ARMOR from '~/data/armor';

  export default {
    name: 'InventoryArmor',
    props: {
      armor: {
        type: Object,
        required: true,
      },
    },
    computed: {
      featureDescription() {
        if (!this.armor.feature) return null;

        const feature = ARMOR.features.find(
          (feature) => feature.name === this.armor.feature,
        );
        const modifiers = feature && feature.modify
          ? modifierString(feature.modify)
          : null;

        if (feature.description && modifiers) return `${modifiers}. ${feature.description}`;
        if (!modifiers) return feature.description;
        if (!feature.description) return modifiers;

        return null;
      },
    },
    methods: {
      titleCase,
    },
  };
</script>
