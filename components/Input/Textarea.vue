<template lang="pug">
  .input--textarea.flex.flex-col(:class="wrapperClasses")
    label.uppercase.font-bold.text-slate-500(
      v-if="label"
      :class="{ 'sr-only': hideLabel }"
    ) {{ label }}
    textarea.px-4.py-2.text-xl.resize-none.overflow-hidden.outline-0(
      ref="textarea"
      type="text"
      :class="inputClass"
      :value="modelValue"
      @input="inputHandler"
      @keypress="keyPress"
      @keyup="resize"
    )
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
    mounted() {
      this.resize();
    },
    computed: {
      characterCount() {
        return this.modelValue.length;
      },
    },
    methods: {
      resize() {
        this.$refs.textarea.style.height = `${this.$refs.textarea.scrollHeight}px`;
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
  };
</script>
