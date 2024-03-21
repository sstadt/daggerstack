<template lang="pug">
  .input--text.flex.flex-col-reverse(:class="wrapperClasses")
    label.uppercase.font-bold.text-slate-500(v-if="label && !hideLabel") {{ label }}
    input.py-2.text-xl.border-b.border-b-slate-500(
      type="text"
      class="focus:border-b-slate-800"
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

<style lang="scss" scoped>
  .input--inline + :deep(.input--text input[type="text"]) {
    padding-left: 8px;
  }

  input[type="text"] {
    &:focus {
      outline: 0;
    }

    .input--inline & {
      padding-right: 8px;
    }
  }
</style>
