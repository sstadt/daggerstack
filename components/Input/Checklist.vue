<template lang="pug">
  .input--checklist.grid.gap-2(:class="`grid-cols-${cols}`")
    InputCheckbox(
      v-for="option in options"
      v-model="currentValue"
      :value="option.value"
      :label="option.label"
      :disabled="currentValue.length >= maxSelections && !currentValue.includes(option.value)"
    )
</template>

<script>
  import Text from '~/components/Input/Text';

  export default {
    name: 'InputChecklist',
    extends: Text,
    props: {
      modelValue: {
        type: Array,
        required: true,
      },
      options: {
        type: Array,
        required: true,
      },
      max: {
        type: Number,
        default: null,
        validator(val) {
          return Number.isInteger(val) && val > 0;
        },
      },
      cols: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        currentValue: [ ...this.modelValue ],
      };
    },
    computed: {
      maxSelections() {
        return this.max ? this.max : this.options.length;
      },
    },
    watch: {
      currentValue() {
        this.$emit('update:modelValue', this.currentValue);
      },
    },
  };
</script>
