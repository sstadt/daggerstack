<template lang="pug">
  .input--textarea.flex.flex-col(:class="wrapperClasses")
    label.uppercase.font-bold.text-slate-500(
      v-if="label"
      :class="{ 'sr-only': hideLabel }"
    ) {{ label }}
    textarea.px-4.py-2.text-xl.resize-none.outline-0.overflow-hidden.border.transition-all(
      type="text"
      ref="input"
      :class="inputClass"
      :style="inputStyle"
      :value="modelValue"
      @input="inputHandler"
      @keypress="keyPress"
      @keyup="resize"
    )
    textarea.px-4.py-2.text-xl.h-0.opacity-0.m-0.pointer-events-none(ref="shadow" :value="modelValue")
    .flex.justify-between.font-bold
      transition(name="slide-fade-left")
        p.text-red-400(v-if="firstError") {{ firstError.$message }}
      p.text-slate-500.ml-auto(v-if="limit") {{ characterCount }}/{{ limit }}
</template>

<script>
  import Text from '~/components/Input/Text';

  export default {
    name: 'InputTextarea',
    extends: Text,
    props: {
      limit: {
        type: Number,
        default: null,
      },
    },
    data() {
      return {
        height: 0,
      };
    },
    mounted() {
      this.resize();
    },
    computed: {
      characterCount() {
        return this.modelValue.length;
      },
      inputStyle() {
        return {
          height: `${this.height}px`,
        };
      },
    },
    methods: {
      resize() {
        this.height = this.$refs.shadow.scrollHeight;
      },
      keyPress($event) {
        if (this.limit !== null && this.characterCount >= this.limit) {
          $event.preventDefault();

          if (this.characterCount >= this.limit) {
            this.$emit(
              'update:modelValue',
              $event.target.value.substring(0, this.limit),
            );
          }
        }
      },
      inputHandler($event) {
        this.$emit('update:modelValue', $event.target.value);
      },
    },
    // watch: {
    //   modelValue() {
    //     this.resize();
    //   },
    // },
  };
</script>
