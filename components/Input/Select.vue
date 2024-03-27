<template lang="pug">
  .input--select.flex.flex-col-reverse(:class="wrapperClasses")
    label.uppercase.font-bold.text-slate-500(v-if="label && !hideLabel") {{ label }}
    select.w-full.px-4.py-2.text-xl.bg-slate-100.outline-0(
      class="focus:bg-slate-200"
    )
      option(v-if="!required")
      option(v-for="option in options" :value="option.value") {{ option.label }}
</template>

<script>
  import Text from '~/components/Input/Text';

  export default {
    name: 'InputSelect',
    extends: Text,
    props: {
      options: {
        type: Array,
        required: true,
      },
    },
  };
</script>
