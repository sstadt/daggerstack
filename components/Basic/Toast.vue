<template lang="pug">
  transition(name="slide-fade-bottom")
    .toast.fixed.bottom-0.left-0.w-full.py-4.px-8.z-50.bg-black(v-if="message")
      BasicMarkdown.text-white.text-lg(:source="message.body")
      .absolute.bottom-0.left-0.bg-slate-400.h-px.transition-all(:style="timerStyle")
</template>

<script>
  import { mapState } from 'pinia';
  import { useToastStore } from '~/stores/toast';

  export default {
    name: 'BasicToast',
    data() {
      return {
        start: 0,
        current: 0,
      };
    },
    setup() {
      const toastStore = useToastStore();

      return { toastStore };
    },
    computed: {
      ...mapState(useToastStore, ['duration']),
      toastWidth() {
        return this.$refs.toast?.clientWidth;
      },
      message() {
        return this.toastStore
          ? this.toastStore.message
          : null;
      },
      timeLeft() {
        return this.current - this.start;
      },
      progress() {
        return Math.floor(this.timeLeft / this.duration * 100);
      },
      timerStyle() {
        return {
          'width': `${100 - this.progress}%`,
        };
      },
    },
    methods: {
      startTimer() {
        this.start = new Date().getTime();
        this.tick();
      },
      scheduleTick() {
        setTimeout(this.tick, 16.66666);
      },
      tick() {
        this.current = new Date().getTime();

        this.$nextTick(() => {
          if (this.progress < 100) {
            this.scheduleTick();
          }
        });
      },
    },
    watch: {
      message(newVal, oldVal) {
        if (newVal && newVal !== oldVal) this.startTimer();
      }
    },
  };
</script>
