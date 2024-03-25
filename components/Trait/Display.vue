<template lang="pug">
  .text-center
    .shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
      .bg-black.px-2.rounded-t.flex.justify-center.items-center.space-x-1.w-full(class="py-0.5")
        p.text-xs.uppercase.font-bold.text-white.truncate {{ title }}
      p.text-3xl.my-auto.py-4.px-2
        span(v-if="modifier && score > 0") +
        | {{ score }}
    p.text-xs.text-slate-500.mt-1 {{ helperText }}
</template>

<script>
  export default {
    name: 'AttributeDisplay',
    props: {
      title: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
      modifier: {
        type: Boolean,
        default: false,
      },
      helperText: {
        type: String,
        default: null,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .upgrade-indicator {
    gap: 0;
  }
</style>
