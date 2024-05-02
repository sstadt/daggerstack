<template lang="pug">
  button.button.text-lg.rounded-md.uppercase.font-bold.border.transition-all(
    class="hover:shadow-md active:shadow-md"
    :class="buttonClass"
    :type="type"
    :disabled="disabled"
  )
    slot
</template>

<script>
  export default {
    name: 'BasicButton',
    props: {
      type: {
        type: String,
        default: 'button',
      },
      size: {
        type: String,
        default: 'md',
        validator(value) {
          return ['xs', 'sm', 'md', 'lg'].includes(value);
        },
      },
      priority: {
        type: String,
        default: 'primary',
        validator(value) {
          return ['primary', 'secondary'].includes(value);
        },
      },
      disabled: {
        type: Boolean,
        defaut: false,
      },
    },
    computed: {
      buttonClass() {
        return {
          'text-xs py-1 px-1.5': this.size === 'xs',
          'text-sm py-1 px-4': this.size === 'sm',
          'py-4 px-6 text-lg': this.size === 'md',
          'py-5 px-7 text-xl': this.size === 'lg',
          'text-white bg-violet-800 border-violet-900 hover:bg-violet-950 focus:bg-violet-950': this.priority === 'primary',
          'bg-slate-100 border-slate-300 hover:bg-slate-300 focus:bg-slate-300': this.priority === 'secondary',
          'opacity-30': this.disabled,
        };
      },
    },
  };
</script>
