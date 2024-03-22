<template lang="pug">
  .modal.fixed.top-0.left-0.w-full.h-full.z-30(:class="modalClasses")
    transition(name="off-canvas-top" appear)
      .modal__content.relative.bg-white.h-full.w-full.p-4.ml-auto.overflow-y-auto.shadow(
        v-if="isOpen"
      )
        button.p-3.absolute.top-3.right-3(v-if="close" @click="close()")
          span.u-sr-only Close
          NuxtIcon(name="times")
        .min-h-12.pb-4
          h2.text-center.text-2xl.font-black.uppercase(v-if="title") {{ title }}
        slot
</template>

<script>
  export default {
    name: 'BasicModal',
    props: {
      isOpen: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: null,
      },
      close: {
        type: Function,
        default: null,
      }
    },
    computed: {
      modalClasses() {
        return {
          'pointer-events-none': !this.isOpen,
        };
      },
    },
  };
</script>
