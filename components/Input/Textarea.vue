<template lang="pug">
  .input--text.flex.flex-col-reverse(:class="wrapperClasses")
    label.uppercase.font-bold.text-slate-500(v-if="label && !hideLabel") {{ label }}
    textarea.px-4.py-2.text-xl.bg-slate-100.resize-none.overflow-hidden.outline-0(
      ref="textarea"
      type="text"
      class="focus:bg-slate-300"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup="resize"
    )
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
