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
    p.text-slate-600.text-sm.space-x-1(v-if="feature")
      span.font-bold {{ ucFirst(feature.name) }}
      span.italic(v-if="featureDescription") {{ featureDescription }}
</template>

<script>
  import { SECONDARY_WEAPON_TYPE } from '~/config/equipmentPicker';

  import { ucFirst, featureDescription } from '~/helpers/string';

  import WEAPONS from '~/data/weapons';

  export default {
    name: 'InventoryWeapon',
    props: {
      weapon: {
        type: Object,
        required: true,
      },
      type: {
        type: String,
        default: null,
      },
    },
    computed: {
      secondary() {
        return this.type === SECONDARY_WEAPON_TYPE;
      },
      showMainHand() {
        return this.weapon.primary === true;
      },
      showOffhand() {
        return this.weapon.burden > 1 || (!this.weapon.primary && this.weapon.secondary);
      },
      feature() {
        const featureName = this.secondary || this.weapon.primary === false
          ? this.weapon.secondaryFeature
          : this.weapon.feature;

        if (!featureName) return null;

        return WEAPONS.features.find((feature) => feature.name === featureName);
      },
      featureDescription() {
        return this.feature ? featureDescription(this.feature) : null;
      },
    },
    methods: {
      ucFirst,
    },
  };
</script>
