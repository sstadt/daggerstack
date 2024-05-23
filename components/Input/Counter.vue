<template lang="pug">
  .flex
    label.text-2xl.font-bold.mr-4(v-if="label") {{ label }}
    .input--counter.flex.items-center.space-x-2
      BasicButton.flex(
        size="xs"
        :disabled="decrementDisabled"
        @click="decrement"
      )
        NuxtIcon(name="minus")
      p.text-xl.font-bold
        span(v-if="modifier") +
        | {{ modelValue }}
      BasicButton.flex(
        size="xs"
        :disabled="incrementDisabled"
        @click="increment"
      )
        NuxtIcon(name="plus")
</template>

<script>
  import Text from '~/components/Input/Text';

  export default {
    name: 'InputCounter',
    extends: Text,
    props: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        required: true,
      },
      modifier: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        currentValue: this.modelValue,
      };
    },
    computed: {
      incrementDisabled() {
        return this.modelValue >= this.max;
      },
      decrementDisabled() {
        return this.modelValue <= this.min;
      },
    },
    methods: {
      increment() {
        this.currentValue += 1;
        this.$emit('update:modelValue', this.currentValue);
      },
      decrement() {
        this.currentValue -= 1;
        this.$emit('update:modelValue', this.currentValue);
      },
    },
  };
</script>
