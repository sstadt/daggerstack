<template lang="pug">
  .drawer.fixed.top-0.left-0.w-full.h-full.z-20(:class="drawerClasses")
    transition(name="fade" appear)
      .drawer__overlay.absolute.w-full.h-full.bg-black.opacity-30(v-if="isOpen" @click="close")
    transition(name="off-canvas-right" appear)
      .drawer__content.pb-8.relative.flex.flex-col.bg-white.h-full.ml-auto.overflow-y-auto.shadow(
        v-if="isOpen"
        class="w-11/12"
        v-touch:swipe.right="() => close()"
      )
        button.p-3.absolute.top-3.right-3(@click="close")
          span.sr-only Close
          NuxtIcon(name="times")
        .min-h-16.py-4
          h2.text-center.text-2xl.font-black.uppercase(v-if="title") {{ title }}
        slot
</template>

<script>
  export default {
    name: 'BasicDrawer',
    props: {
      title: {
        type: String,
        default: null,
      },
    },
    data() {
      return {
        isOpen: false,
      };
    },
    computed: {
      drawerClasses() {
        return {
          'pointer-events-none': !this.isOpen,
        };
      },
    },
    methods: {
      open() {
        this.isOpen = true;
      },
      close() {
        this.isOpen = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .drawer__content {
    max-width: 360px;
  }
</style>
