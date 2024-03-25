<template lang="pug">
  .flex.justify-center.align-center
    .flex.items-center(v-for="n in steps")
      button.flex.justify-center.items-center.u-radius-50.p-4.h-10.w-10.border-2.border-black.transition-colors.shadow-md(
        :class="{ 'bg-black text-white': n === page + 1 }"
        @click="$emit('set', n - 1)"
      )
        span.text-xl {{ n }}
      .w-4.h-1.bg-black.shadow-md(v-if="n < steps")
</template>

<script>
  export default {
    name: 'BuilderProgress',
    props: {
      page: {
        type: Number,
        default: 0,
      },
      steps: {
        type: Number,
        default: 5,
      },
    },
  };
</script>
