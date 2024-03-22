<template lang="pug">
  .modal.fixed.top-0.left-0.w-full.h-full.z-20(:class="drawerClasses")
    transition(name="off-canvas-right" appear)
      .modal__content.relative.bg-white.h-full.w-full.p-4.ml-auto.overflow-y-auto.shadow(
        v-if="isOpen"
      )
        button.p-3.absolute.top-3.right-3(@click="close")
          span.u-sr-only Close
          NuxtIcon(name="times")
        .min-h-12.pb-4
          h2.text-center.text-2xl.font-black.uppercase(v-if="title") {{ title }}
        slot
</template>

<script>
  import Drawer from '~/components/Basic/Drawer';

  export default {
    name: 'ComponentName',
    extends: Drawer,
  };
</script>
