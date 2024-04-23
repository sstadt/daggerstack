<template lang="pug">
  .sheet-header.sticky.top-0.z-10
    .sheet-header__title.flex-none.py-4.px-6.bg-black.text-white(@click="openHealth")
      h1.font-bold.text-4xl.uppercase.truncate {{ character.name }}
      p.text-slate-400.flex.justify-between
        span Level {{ character.level }} {{ character.heritage }} {{ character.baseClass }}
        span {{ character.pronouns }}
    slot
    BasicDrawer(ref="health" title="Character")
      SheetHealth(:character="character")
</template>

<script>
  export default {
    name: 'SheetHeader',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    methods: {
      openHealth() {
        this.$refs.health.open();
      },
    },
  };
</script>
