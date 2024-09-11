<template lang="pug">
  .drawer.fixed.top-0.left-0.w-full.h-full.z-20(:class="drawerClass")
    transition(name="fade" appear)
      .drawer__overlay.absolute.w-full.h-full.bg-black.opacity-30(v-if="isOpen" @click="close")
    transition(name="off-canvas-right" appear @after-leave="$emit('close')")
      .drawer__content.pb-8.relative.flex.flex-col.bg-white.h-full.ml-auto.overflow-y-auto.shadow(
        v-if="isOpen"
        class="w-11/12"
        v-touch:swipe.right="() => close()"
      )
        button.p-3.absolute.top-3.right-3(@click="close")
          span.sr-only Close
          NuxtIcon(name="times")
        .min-h-16.py-4.px-6
          h2.text-center.text-2xl.font-black.uppercase(v-if="title") {{ title }}
        slot
</template>

<script>
  export default {
    name: 'BasicDrawer',
  };
</script>

<script setup>
  import { defineExpose } from 'vue';

  const {
    isOpen,
    useDrawerClass,
    open,
    close,
  } = useModal();

  const props = defineProps({
    title: {
      type: String,
      default: null,
    },
  });

  const drawerClass = useDrawerClass();

  defineExpose({ open, close });
</script>

<style lang="scss" scoped>
  .drawer__content {
    max-width: 360px;
  }
</style>
