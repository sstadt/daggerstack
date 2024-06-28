<template lang="pug">
  .checkbox-counter.flex.items-center.flex-wrap
    h3.text-lg.font-bold.uppercase.w-20(v-if="label")
      | {{ label }}
    InputCheckbox(
      v-for="n in max"
      v-model="currentValue"
      :key="`${key}-${n}`"
      :value="n - 1"
      :disabled="n > maxSelectable || n <= min"
      @click.prevent="updateValue(n)"
    )
    p.text-xs.text-slate-500.ml-auto.w-full(v-if="helperText !== null")
      | {{ helperText }}
</template>

<script>
  import { uuidv4 } from '~/helpers/utility';

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
      increment: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        key: uuidv4(),
        currentValue: [...Array(this.modelValue).keys()],
        maxSelectable: this.enabled !== null
          ? this.enabled
          : this.max,
      };
    },
    methods: {
      updateValue(n) {
        let updated = false;

        if (n > this.currentValue.length && this.currentValue.length + 1 <= this.max) {
          for (let i = 0; i < this.increment; i++) {
            this.currentValue.push(this.currentValue.length);
          }
          updated = true;
        } else if (n <= this.currentValue.length && this.currentValue.length - 1 >= this.min) {
          for (let i = 0; i < this.increment; i++) {
            this.currentValue.pop();
          }
          updated = true;
        }

        if (updated) {
          this.key = uuidv4();
          this.$emit('update:modelValue', this.currentValue.length);
        }
      },
    },
    watch: {
      enabled(newVal, oldVal) {
        if (newVal !== null && newVal !== oldVal) {
          this.maxSelectable = newVal;
        }
      },
    },
  };
</script>
