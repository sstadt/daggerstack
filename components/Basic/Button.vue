<template lang="pug">
  button.button.text-lg.uppercase.font-bold.border.transition-all(
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
  };
</script>

<script setup>
  const props = defineProps({
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
    rounded: {
      type: String,
      default: 'all',
      validator(value) {
        return ['all', 'left', 'right'].includes(value);
      },
    },
    icon: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      defaut: false,
    },
  });

  const buttonClass = computed(() => {
    return {
      'text-xs py-1 px-1.5': props.size === 'xs' && !props.icon,
      'text-sm p-1': props.size === 'xs' && props.icon,
      'text-sm py-1 px-4': props.size === 'sm' && !props.icon,
      'px-2.5 py-1': props.size === 'sm' && props.icon,
      'py-4 px-6 text-lg': props.size === 'md',
      'py-5 px-7 text-xl': props.size === 'lg',
      'text-white bg-violet-800 border-violet-900 hover:bg-violet-950 focus:bg-violet-950': props.priority === 'primary',
      'bg-slate-100 border-slate-300 hover:bg-slate-300 focus:bg-slate-300': props.priority === 'secondary',
      'opacity-30': props.disabled,
      'rounded-md': props.rounded === 'all',
      'rounded-r-md': props.rounded === 'right',
      'rounded-l-md': props.rounded === 'left',
    };
  });
</script>
