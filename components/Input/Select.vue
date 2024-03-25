<template lang="pug">
  .input--select.flex.flex-col-reverse(:class="wrapperClasses")
    label.uppercase.font-bold.text-slate-500(v-if="label && !hideLabel") {{ label }}
    select.w-full.py-2.text-xl.border-b.border-b-slate-500
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
