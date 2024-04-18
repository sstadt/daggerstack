<template lang="pug">
  .w-full
    .flex.justify-between.items-center
      h3.text-xl.font-bold.truncate {{ weapon.name }}
      .flex
        NuxtIcon(v-if="showMainHand" name="left-hand")
        NuxtIcon(v-if="showOffhand" name="right-hand")
    .flex.justify-between
      p {{ ucFirst(weapon.trait) }} {{ weapon.range }}
      p {{ weapon.damage }} ({{ weapon.damageType }})
    p.text-slate-600.text-sm.space-x-1(v-if="weapon.feature")
      span.font-bold {{ ucFirst(weapon.feature) }}
      span.italic(v-if="featureDescription") {{ featureDescription }}
</template>

<script>
  import { ucFirst, modifierString } from '~/helpers/string';

  import WEAPONS from '~/data/weapons';

  export default {
    name: 'InventoryWeapon',
    props: {
      weapon: {
        type: Object,
        required: true,
      },
    },
    computed: {
      showMainHand() {
        return this.weapon.primary === true;
      },
      showOffhand() {
        return this.weapon.burden > 1 || (!this.weapon.primary && this.weapon.secondary);
      },
      featureDescription() {
        if (!this.weapon.feature) return null;

        const feature = WEAPONS.features.find(
          (feature) => feature.name === this.weapon.feature,
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
      ucFirst,
    },
  };
</script>
