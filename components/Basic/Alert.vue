<template lang="pug">
  p.alert.px-4.py-3.rounded.border(:class="alertClass")
    BasicMarkdown(:source="message")
</template>

<script>
  export default {
    name: 'BasicAlert',
    props: {
      message: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        default: 'primary',
        validator(val) {
          return ['primary', 'info', 'success', 'warning', 'error'].includes(val);
        },
      },
    },
    computed: {
      alertClass() {
        return {
          'bg-slate-100 border-slate-300 text-slate-500': this.type === 'primary',
          'bg-cyan-200 border-cyan-300 text-cyan-700': this.type === 'info',
          'bg-green-200 border-green-300 text-green-800': this.type === 'success',
          'bg-yellow-200 border-amber-300 text-amber-700': this.type === 'warning',
          'bg-red-200 border-red-300 text-red-900': this.type === 'error',
        };
      },
    },
  };
</script>
