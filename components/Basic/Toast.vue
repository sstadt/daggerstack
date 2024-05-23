<template lang="pug">
  transition(name="slide-fade-bottom")
    .toast.fixed.bottom-0.left-0.w-full.py-4.px-8.z-40.bg-black(v-if="message")
      BasicMarkdown.text-white.text-lg(:source="message.body")
</template>

<script>
  import { useToastStore } from '~/stores/toast';

  export default {
    name: 'BasicToast',
    setup() {
      const toastStore = useToastStore();

      return { toastStore };
    },
    computed: {
      message() {
        return this.toastStore
          ? this.toastStore.message
          : null;
      },
    },
  };
</script>
