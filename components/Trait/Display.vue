<template lang="pug">
  .text-center(:style="displayStyle")
    .flex.items-center(:class="displayClass")
      .u-angled-corners.bg-black.px-2.w-full(class="py-0.5" :class="titleClass")
        p.text-xs.uppercase.font-bold.text-white.truncate {{ title }}
      p.text-3xl.my-auto(:class="scoreClass")
        span(v-if="modifier && score > 0") +
        | {{ score }}
    p.text-xs.text-slate-500(v-if="helperText" class="-translate-y-1") {{ helperText }}
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
      upgraded: {
        type: Boolean,
        default: false,
      },
      helperText: {
        type: String,
        default: null,
      },
    },
    computed: {
      isStatistic() {
        return !['evasion', 'armor'].includes(this.title);
      },
      displayClass() {
        return {
          'flex-col-reverse relative': !this.isStatistic,
          'flex-col u-bg-statistic': this.isStatistic,
          'u-bg-evasion': this.title === 'evasion',
          'u-bg-armor': this.title === 'armor',
        };
      },
      displayStyle() {
        return {
          'max-width': `${this.isStatistic ? '93' : '106'}px`,
        };
      },
      titleClass() {
        return {
          'absolute bottom-5 left-0 w-full': !this.isStatistic,
        };
      },
      scoreClass() {
        return {
          'pt-3 pb-8': this.isStatistic,
          'pt-8 pb-11': !this.isStatistic,
        };
      },
    },
  };
</script>
