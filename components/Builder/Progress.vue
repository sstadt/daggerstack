<template lang="pug">
  .flex.justify-center.align-center.space-x-1.pb-4
    .flex.items-center(v-for="n in steps")
      button.w-8.transition-colors.shadow-md(
        class="h-1.5"
        :class="{ 'bg-black': n === page + 1, 'bg-slate-400': n !== page + 1 }"
        @click="$emit('set', n - 1)"
      )
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
