<template lang="pug">
  .modal.fixed.top-0.left-0.w-full.h-full.z-40(:class="drawerClasses")
    transition(name="slide-fade-bottom" appear)
      .flex.flex-col.h-full.relative.bg-white.h-full.w-full.ml-auto.overflow-y-auto.shadow(
        v-if="isOpen"
      )
        button.p-3.absolute.top-3.right-3(@click="close")
          span.sr-only Close
          NuxtIcon(name="times")
        .min-h-12.p-4
          h2.text-center.text-2xl.font-black.uppercase(v-if="title") {{ title }}
        slot
</template>

<script>
  import Drawer from '~/components/Basic/Drawer';

  export default {
    name: 'BasicModal',
    extends: Drawer,
  };
</script>
