<template lang="pug">
  .w-full
    .flex.space-x-2.justify-between
      h3.text-lg.font-bold.truncate {{ armor.name }}
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
  };
</script>
