<template lang="pug">
  .space-y-2
    label.uppercase.font-bold.text-slate-500(
      v-if="label"
      :class="{ 'sr-only': hideLabel }"
    ) {{ label }}
    .input--checklist.grid.gap-2.w-full(:class="`grid-cols-${cols}`")
      InputCheckbox(
        v-for="option in options"
        v-model="currentValue"
        :value="option.value"
        :label="option.label"
        :disabled="isDisabled(option)"
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
        type: [ Number, String ],
        default: 1,
      },
      disabled: {
        type: Array,
        default: () => [],
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
    methods: {
      isDisabled(option) {
        if (this.currentValue.includes(option.value)) return false;

        return this.disabled.includes(option.value) ||
          this.currentValue.length >= this.maxSelections;
      },
    },
    watch: {
      currentValue() {
        this.$emit('update:modelValue', this.currentValue);
      },
    },
  };
</script>
