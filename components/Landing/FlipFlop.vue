<template lang="pug">
  .py-24(:class="rootClass")
    .flex.flex-col.items-center.container.w-max-5xl.space-y-12(
      class="md:flex-row md:space-y-auto"
      :class="containerClass"
    )
      .flex.flex-col.justify-center.items-center(
        class="md:w-1/2 md:px-6 md:py-10"
        :class="visualClass"
      )
        slot(name="visual")
      .flex.flex-col.justify-center.items-center(
        class="md:w-1/2 md:px-6 md:py-10"
        :class="descriptionClass"
      )
        slot(name="description")
</template>

<script>
  export default {
    name: 'BasicFlipFlop',
    props: {
      flip: {
        type: Boolean,
        default: false,
      },
      dark: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      rootClass() {
        return {
          'bg-violet-800 text-white': this.dark,
        };
      },
      containerClass() {
        return {
          'md:flex-row-reverse': this.flip,
        };
      },
      visualClass() {
        return {
          'md:border-r': !this.flip && !this.dark,
          'md:border-r md:border-violet-500': !this.flip && this.dark,
        };
      },
      descriptionClass() {
        return {
          'md:border-r': this.flip && !this.dark,
          'md:border-r md:border-violet-500': this.flip && this.dark,
        };
      },
    },
  };
</script>
