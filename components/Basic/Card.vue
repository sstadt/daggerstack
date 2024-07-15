<template lang="pug">
  .card.rounded-lg.bg-white
    .pb-2.border-b(v-if="title || subtitle")
      h2.px-8.text-center.text-2xl.font-black.uppercase(
        v-if="title"
        class="lg:text-xl"
      ) {{ title }}
      p.text-center.mb-2.text-sm.text-slate-500(v-if="subtitle") {{ subtitle }}
    div.card__content.px-8(class="md:px-0")
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
  };
</script>
