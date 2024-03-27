<template lang="pug">
  .container.px-8.pb-4.space-y-8
    .space-y-4
      h2.text-center.text-2xl.font-black.uppercase Experience
      .flex.items-center
        p.p-4.text-lg.font-bold +2
        InputText.flex-grow(v-model="experience1")
      .flex.items-center
        p.p-4.text-lg.font-bold +1
        InputText.flex-grow(v-model="experience2")
    .space-y-4
      h2.text-center.text-2xl.font-black.uppercase Identity
      .flex
        InputText.flex-grow(v-model="name" label="name")
        button.u-inline-button.bg-slate-100.px-4.ml-1.flex.items-center.justify-center.border-l-white(@click="generateName")
          NuxtIcon.text-2xl(name="d20")
          .sr-only Generate random name
      InputText.flex-grow(v-model="name" label="pronouns")
    BasicButton.block.ml-auto(@click="$emit('next')") Next
</template>

<script>
  export default {
    name: 'BuilderStep7',
    data() {
      return {
        experience1: '',
        experience2: '',
        name: '',
        pronouns: '',
      };
    },
    methods: {
      generateName() {
        // TODO: generate random name from data
        console.log('>>> TODO: name generator');
      },
    },
  };
</script>
