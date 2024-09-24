<template lang="pug">
  .input--counter.inline-block
    label.uppercase.font-bold.text-slate-500(
      v-if="label"
      :class="{ 'sr-only': hideLabel }"
    ) {{ label }}
    .flex.items-stretch.divide-x.divide-slate-150.border.bg-slate-100
      button.flex.justify-center.items-center.px-3.transition-colors.text-sm.text-violet-800(
        type="button"
        class="hover:bg-violet-800 hover:text-white"
        :class="{ 'opacity-30 pointer-events-none': decrementDisabled }"
        :disabled="decrementDisabled"
        @click="decrement"
      )
        NuxtIcon(name="minus")
      p.px-3.py-2.text-xl
        span(v-if="modifier") +
        | {{ modelValue }}
      button.flex.justify-center.items-center.px-3.transition-colors.text-sm.text-violet-800(
        type="button"
        class="hover:bg-violet-800 hover:text-white"
        :class="{ 'opacity-30 pointer-events-none': incrementDisabled }"
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
        default: 9999,
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
