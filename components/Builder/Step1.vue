<template lang="pug">
  .container.px-8.pb-4.space-y-8
    InputSelect(:options="classOptions" label="class" required)
    InputText(label="subclass")
    InputText(label="heritage")
    BasicButton.block.ml-auto(@click="$emit('next')") Next
</template>

<script>
  import generalData from '~/data/general';
  import { ucFirst } from '~/helpers/string';

  export default {
    name: 'BuilderStep1',
    data() {
      return {
        classOptions: Object.keys(generalData.classes).map(className => ({
          label: ucFirst(className),
          value: className,
        })),
      };
    },
  };
</script>
