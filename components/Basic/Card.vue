<template lang="pug">
  .card.rounded-lg.bg-white
    .pb-2.border-b(v-if="title || subtitle")
      h2.px-4.text-center.text-2xl.font-black.uppercase(v-if="title") {{ title }}
      p.text-center.mb-2.text-sm.text-slate-500(v-if="subtitle") {{ subtitle }}
    div.card__content(:class="contentClasses")
      slot
</template>

<script>
  export default {
    name: 'Card',
    props: {
      title: {
        type: String,
        default: null,
      },
      subtitle: {
        type: String,
        default: null,
      },
      expand: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      contentClasses() {
        return {
          'px-8': !this.expand,
        };
      },
    },
  };
</script>
