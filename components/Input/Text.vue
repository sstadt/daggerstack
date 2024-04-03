<template lang="pug">
  .input--text.flex.flex-col(:class="wrapperClasses")
    label.uppercase.font-bold.text-slate-500(v-if="label && !hideLabel")
      | {{ label }}
      span(v-if="required") *
    input.px-4.py-2.text-xl.outline-0(
      type="text"
      :class="inputClass"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    )
    transition(name="slide-fade-left")
      p.text-red-400.font-bold(v-if="firstError") {{ firstError.$message }}
</template>

<script>
  export default {
    name: 'InputText',
    props: {
      modelValue: {},
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
      placeholder: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      required: {
        type: Boolean,
        default: false,
      },
      errors: {
        type: Array,
        default: [],
      },
    },
    computed: {
      wrapperClasses() {
        return {
          'disabled': this.disabled,
        };
      },
      inputClass() {
        return {
          'bg-slate-100 focus:bg-slate-200': this.errors.length === 0,
          'bg-red-100 focus:bg-red-200': this.errors.length > 0
        };
      },
      firstError() {
        const [firstError] = this.errors;
        return firstError;
      },
    },
  };
</script>
