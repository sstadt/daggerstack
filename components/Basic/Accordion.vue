<template lang="pug">
  .accordion
    button.text-left.py-4.px-6.text-xl.font-bold.w-full(@click="toggle") {{ title }}
    .overflow-hidden(
      ref="$content"
      :class="contentClass"
      :style="contentStyle"
    )
      slot
</template>

<script>
  export default {
    name: 'BasicAccordion',
  };
</script>

<script setup>
  const emit = defineEmits(['open', 'close']);

  const props = defineProps({
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
  });

  const scrollHeight = ref(0);
  const isOpen = ref(props.startOpen);
  const mounted = ref(false);
  const $content = ref(null);

  const contentClass = computed(() => {
    return {
      'transition-all': mounted.value,
      'opacity-100': isOpen.value,
      'opacity-0 pointer-events-none': !isOpen.value,
    };
  });

  const contentStyle = computed(() => {
    return {
      height: `${scrollHeight.value}px`,
    };
  });

  const open = () => {
    isOpen.value = true;
  };

  const setOpenState = () => {
    scrollHeight.value = $content.value.scrollHeight;

    // do this twice, in case opening the accordion creates a scrollbar
    // and changes the scrollHeight
    setTimeout(() => {
      scrollHeight.value = $content.value.scrollHeight;
    }, 300);
    emit('open', props.id);
  };

  const close = () => {
    isOpen.value = false;
  };

  const setCloseState = () => {
    scrollHeight.value = 0;
    emit('close', props.id);
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  onMounted(() => {
    if (props.startOpen) {
      setOpenState();
    }

    nextTick().then(() => {
      mounted.value = true;
    });
  });

  watch(isOpen, (newVal) => {
    if (newVal === true) {
      setOpenState();
    } else {
      setCloseState();
    }
  });

  watch(() => props.activeAccordion, (newVal) => {
    if (props.id) {
      if (newVal === props.id && !isOpen.value) {
        isOpen.value = true;
      } else if (newVal !== props.id && isOpen.value) {
        isOpen.value = false;
      }
    }
  });
</script>
