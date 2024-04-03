<template lang="pug">
  .input--text.flex.flex-col(:class="wrapperClasses")
    label.uppercase.font-bold.text-slate-500(v-if="label && !hideLabel") {{ label }}
    textarea.px-4.py-2.text-xl.resize-none.overflow-hidden.outline-0(
      ref="textarea"
      type="text"
      :class="inputClass"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup="resize"
    )
    transition(name="slide-fade-left")
      p.text-red-400.font-bold(v-if="firstError") {{ firstError.$message }}
</template>

<script>
  import Text from '~/components/Input/Text';

  export default {
    name: 'InputTextarea',
    extends: Text,
    mounted() {
      this.resize();
    },
    methods: {
      resize() {
        const $el = this.$refs.textarea;

        $el.style.height = "auto";
        $el.style.height = `${$el.scrollHeight}px`;
      },
    }
  };
</script>
