<template lang="pug">
  .w-full.space-y-1
    .flex.justify-between.items-center
      h3.text-xl.font-bold.truncate {{ weapon.name }}
      .flex
        NuxtIcon(v-if="showMainHand" name="left-hand")
        NuxtIcon(v-if="showOffhand" name="right-hand")
    .flex.justify-between
      p {{ weapon.trait }} {{ weapon.range }}
      p {{ weapon.damage }} ({{ weapon.damageType }})
    p.text-slate-600.text-sm.space-x-1(v-if="weapon.feature")
      span.font-bold {{ weapon.feature.label }}
      span.italic {{ weapon.feature.description }}
</template>

<script>
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
      showMainHand() {
        return this.weapon.slot === 'primary';
      },
      showOffhand() {
        return this.weapon.burden > 1 || this.weapon.slot === 'secondary';
      },
    },
  };
</script>
