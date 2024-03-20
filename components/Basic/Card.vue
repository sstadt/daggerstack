<template lang="pug">
  .card.rounded-lg.shadow.p-4.bg-white.border.border-slate-400
    .pb-2.border-b(v-if="title || subtitle")
      h2.text-center.text-2xl.font-black.uppercase(v-if="title") {{ title }}
      p.text-center.mb-2.text-sm.text-slate-500(v-if="subtitle") {{ subtitle }}
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
    },
  };
</script>
