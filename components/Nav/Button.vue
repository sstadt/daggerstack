<template lang="pug">
  button.py-2.transition-colors(class="hover:bg-slate-800 active:bg-slate-800")
    NuxtIcon.nav-button__icon.text-white(:name="icon")
</template>

<script>
  export default {
    name: 'NavButton',
    props: {
      icon: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  $icon-size: 40px;

  .nav-button__icon:deep(svg) {
    width: $icon-size;
    height: $icon-size;
  }
</style>
