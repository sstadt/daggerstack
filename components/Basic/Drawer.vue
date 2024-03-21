<template lang="pug">
  .drawer.fixed.top-0.left-0.w-full.h-full.z-20(:class="drawerClasses")
    transition(name="fade")
      .drawer__overlay.absolute.w-full.h-full.bg-black.opacity-30(v-if="isOpen")
    transition(name="off-canvas-right")
      .drawer__content.relative.bg-white.h-full.p-4.ml-auto.overflow-y-auto.shadow(
        v-if="isOpen"
        class="w-11/12"
      )
        h2.text-center.text-2xl.font-black.uppercase.mb-6(v-if="title") {{ title }}
        button.p-3.absolute.top-3.right-3(@click="close")
          span.u-sr-only Close
          NuxtIcon(name="times")
        slot
</template>

<script>
  export default {
    name: 'BasicDrawer',
    data() {
      return {
        isOpen: true,
      };
    },
    props: {
      title: {
        type: String,
        default: null,
      },
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
        this.isOpem = true;
      },
      close() {
        this.isOpen = false;
      },
    },
  };
</script>
