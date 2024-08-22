<template lang="pug">
  p.alert.px-4.py-3.rounded.border(:class="alertClass")
    BasicMarkdown(v-if="message" :source="message")
    slot(v-else)
</template>

<script>
  export default {
    name: 'BasicAlert',
  };
</script>

<script setup>
  const props = defineProps({
    message: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'primary',
      validator(val) {
        return ['primary', 'info', 'success', 'warning', 'error'].includes(val);
      },
    },
  });

  const alertClass = computed(() => {
    return {
      'bg-slate-100 border-slate-300 text-slate-500': props.type === 'primary',
      'bg-cyan-200 border-cyan-300 text-cyan-700': props.type === 'info',
      'bg-green-200 border-green-300 text-green-800': props.type === 'success',
      'bg-yellow-200 border-amber-300 text-amber-700': props.type === 'warning',
      'bg-red-200 border-red-300 text-red-900': props.type === 'error',
    };
  });
</script>
