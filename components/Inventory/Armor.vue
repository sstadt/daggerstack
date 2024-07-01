<template lang="pug">
  .w-full
    .flex.space-x-2.justify-between
      h3.text-lg.font-bold.truncate(:class="titleClass") {{ armor.name }}
      p.text-lg {{ armor.score }}
    p.text-sm.text-slate-600(v-if="armor.feature")
      span.font-bold.mr-1 {{ armor.feature.label }}
      span.italic {{ armor.feature.description }}
</template>

<script>
  export default {
    name: 'InventoryArmor',
    props: {
      armor: {
        type: Object,
        required: true,
      },
    },
    computed: {
      titleClass() {
        return {
          'text-blue-600': this.armor.tier === 1,
          'text-purple-700': this.armor.tier === 2,
          'text-orange-600': this.armor.tier === 3,
        };
      },
    },
  };
</script>
