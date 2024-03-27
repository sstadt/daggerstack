<template lang="pug">
  .input--text.flex.flex-col-reverse(:class="wrapperClasses")
    label.uppercase.font-bold.text-slate-500(v-if="label && !hideLabel") {{ label }}
    input.px-4.py-2.text-xl.bg-slate-100.outline-0(
      type="text"
      class="focus:bg-slate-200"
      :class="inputClasses"
    )
</template>

<script>
  export default {
    name: 'InputText',
    props: {
      label: {
        type: String,
        default: null,
      },
      hideLabel: {
        type: Boolean,
        default: false,
      },
      name: {
        type: String,
        default: null,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      inline: {
        type: Boolean,
        default: false,
      },
      required: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      wrapperClasses() {
        return {
          'disabled': this.disabled,
          'input--inline': this.inline,
        };
      },
      inputClasses() {
        return {
          'border-r': this.inline,
          'border-r-slate-300': this.inline,
        };
      },
    },
  };
</script>
