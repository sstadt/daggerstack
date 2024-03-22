<template lang="pug">
  .container.p-8.space-y-8
    InputSelect(:options="classOptions" label="class")
    InputText(label="subclass")
    InputText(label="heritage")
    BasicButton(@click="$emit('next')") Next
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
