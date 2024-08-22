<template lang="pug">
  .input--select.flex.flex-col(:class="wrapperClass")
    label.uppercase.font-bold.text-slate-500(
      v-if="label"
      :class="{ 'sr-only': hideLabel }"
    ) {{ label }}
    select.w-full.pl-4.pr-8.py-2.text-xl.outline-0.border(
      :class="inputClass"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    )
      option(v-if="!required")
      option(v-for="option in options" :value="option.value") {{ option.label }}
    transition(name="slide-fade-left")
      p.text-red-400.font-bold(v-if="firstError") {{ firstError.$message }}
</template>

<script>
  export default {
    name: 'InputSelect',
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
    options: {
      type: Array,
      required: true,
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
    };
  });

  const firstError = computed(() => {
    const [firstError] = props.errors;
    return firstError;
  });
</script>
