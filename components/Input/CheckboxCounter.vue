<template lang="pug">
  .checkbox-counter.flex.items-center.flex-wrap
    h3.text-lg.font-bold.uppercase.w-20(v-if="label")
      | {{ label }}
    InputCheckbox(
      v-for="n in max"
      v-model="currentValue"
      :value="n - 1"
      :disabled="n > maxSelectable"
    )
    p.text-xs.text-slate-500.ml-auto.w-full(v-if="helperText !== null")
      | {{ helperText }}
</template>

<script>
  export default {
    name: 'CheckboxCounter',
    props: {
      label: {
        type: String,
        default: null,
      },
      helperText: {
        type: String,
        default: null,
      },
      modelValue: {
        type: Number,
        required: true,
      },
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        required: true,
      },
      enabled: {
        type: Number,
        default: null,
      },
    },
    data() {
      return {
        currentValue: [...Array(this.modelValue).keys()],
        maxSelectable: this.enabled !== null
          ? this.enabled
          : this.max,
      };
    },
    watch: {
      currentValue(newVal) {
        this.$emit('update:modelValue', newVal.length);
      },
      enabled(newVal, oldVal) {
        if (newVal !== null && newVal !== oldVal) {
          this.maxSelectable = newVal;
        }
      },
    },
  };
</script>
