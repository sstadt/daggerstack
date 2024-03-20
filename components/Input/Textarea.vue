<template lang="pug">
  .input--text.flex.flex-col-reverse(:class="wrapperClasses")
    label.uppercase.font-bold.text-slate-500(v-if="label && !hideLabel") {{ label }}
    textarea.px-4.py-2.text-2xl.border-b.border-b-slate-500.resize-none.overflow-hidden(
      ref="textarea"
      type="text"
      class="focus:bg-slate-100"
      :class="inputClasses"
      @keyup="resize"
    )
</template>

<script>
  import Text from '~/components/Input/Text';

  export default {
    name: 'InputTextarea',
    extends: Text,
    methods: {
      resize() {
        const $el = this.$refs.textarea;

        $el.style.height = "auto";
        $el.style.height = `${$el.scrollHeight}px`;
      },
    }
  };
</script>
