<template lang="pug">
  .sheet-header.sticky.top-0.z-10
    .sheet-header__title.flex-none.py-4.px-6.bg-black.text-white(@click="openHealth")
      h1.font-bold.text-4xl.uppercase.truncate Sledge
      p.text-slate-400.flex.justify-between
        span Level 1 Soldierborne Guardian
        span He/Him
    slot
    BasicDrawer(ref="health" title="Character")
      SheetHealth
</template>

<script>
  export default {
    name: 'SheetHeader',
    methods: {
      openHealth() {
        this.$refs.health.open();
      },
    },
  };
</script>
