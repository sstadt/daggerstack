<template lang="pug">
  .input--filter.flex.space-x-2.items-center
    p.text-sm.font-bold.uppercase(v-if="label && !hideLabel") {{ label }}
    label.text-xs.py-1.px-2.rounded.border.transition-colors(
      v-for="option in options"
      :class="getInputClass(currentValue.includes(option))"
    )
      input(
        type="checkbox"
        v-model="currentValue"
        :value="option"
        :disabled="disabled.includes(option)"
        @change="changed"
      )
      span {{ option }}
</template>

<script>
  export default {
    name: 'InputFilter',
    props: {
      label: {
        type: String,
        default: null,
      },
      modelValue: {
        type: Array,
        required: true,
      },
      options: {
        type: Array,
        required: true,
      },
      disabled: {
        type: Array,
        default: () => [],
      },
      hideLabel: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        currentValue: [ ...this.modelValue ],
      };
    },
    methods: {
      changed() {
        this.$emit('update:modelValue', [ ...this.currentValue ]);
      },
      getInputClass(isSelected) {
        return {
          'text-white bg-violet-800 border-violet-800': isSelected,
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  input[type="checkbox"] {
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    margin: 0;
  }
</style>
