<template lang="pug">
  .input--select.flex.flex-col(:class="wrapperClasses")
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
  import Text from '~/components/Input/Text';

  export default {
    name: 'InputSelect',
    extends: Text,
    props: {
      options: {
        type: Array,
        required: true,
      },
    },
  };
</script>
