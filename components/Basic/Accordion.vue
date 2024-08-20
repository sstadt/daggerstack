<template lang="pug">
  .accordion
    button.py-2.border-b.text-xl.font-bold.w-full(@click="toggle") {{ title }}
    .overflow-hidden(
      ref="content"
      :class="contentClass"
      :style="contentStyle"
    )
      slot
</template>

<script>
  export default {
    name: 'BasicAccordion',
    props: {
      id: {
        type: String,
        default: null,
      },
      activeAccordion: {
        type: String,
        default: null,
      },
      title: {
        type: String,
        required: true,
      },
      startOpen: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        scrollHeight: 0,
        isOpen: this.startOpen,
        mounted: false,
      };
    },
    computed: {
      contentClass() {
        return {
          'transition-all': this.mounted,
          'opacity-100': this.isOpen,
          'opacity-0 pointer-events-none': !this.isOpen,
        };
      },
      contentStyle() {
        return {
          height: `${this.scrollHeight}px`,
        };
      },
    },
    mounted() {
      if (this.startOpen) {
        this.setOpenState();
      }

      this.$nextTick(() => {
        this.mounted = true;
      });
    },
    methods: {
      open() {
        this.isOpen = true;
      },
      setOpenState() {
        this.scrollHeight = this.$refs.content.scrollHeight;
        this.$emit('open', this.id);
      },
      close() {
        this.isOpen = false;
      },
      setCloseState() {
        this.scrollHeight = 0;
        this.$emit('close', this.id);
      },
      toggle() {
        this.isOpen = !this.isOpen;
      },
    },
    watch: {
      isOpen(newVal) {
        if (newVal === true) {
          this.setOpenState();
        } else {
          this.setCloseState();
        }
      },
      activeAccordion(newVal) {
        if (this.id) {
          if (newVal === this.id && !this.isOpen) {
            this.isOpen = true;
          } else if (newVal !== this.id && this.isOpen) {
            this.isOpen = false;
          }
        }
      },
    },
  };
</script>
