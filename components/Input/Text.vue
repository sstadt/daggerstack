<template lang="pug">
  .input--text.flex.flex-col(:class="wrapperClass")
    label.uppercase.font-bold.text-slate-500(
      v-if="label && !hideLabel"
      :class="{ 'sr-only': hideLabel }"
    )
      | {{ label }}
      span(v-if="required") *
    input.px-4.py-2.text-xl.outline-0.w-full(
      :type="type"
      :class="inputClass"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    )
    AuthPasswordStrength(v-if="passwordStrength" :password="modelValue")
    transition(name="slide-fade-left")
      p.text-red-400.font-bold(v-if="firstError") {{ firstError.$message }}
</template>

<script>
  export default {
    name: 'InputText',
  };
</script>

<script setup>
  const props = defineProps({
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
    type: {
      type: String,
      default: 'text'
    },
    passwordStrength: {
      type: Boolean,
      default: false,
    },
  });

  const wrapperClass = computed(() => {
    return {
      'disabled': props.disabled,
    };
  });

  const inputClass = computed(() => {
    return {
      'bg-slate-100 focus:bg-slate-200': props.errors.length === 0,
      'bg-red-100 focus:bg-red-200': props.errors.length > 0,
      'border': !props.passwordStrength,
      'border-t border-x': props.passwordStrength,
    };
  });

  const firstError = computed(() => {
    const [firstError] = props.errors;
    return firstError;
  });
</script>
