<template lang="pug">
  .container.p-8.space-y-8
    .space-y-4
      div
        h2.text-center.text-2xl.font-black.uppercase Experience
        p.text-center.mb-2.px-6.text-sm.text-slate-500 Describe two experiences, that make sense for your background, in a word or phrase
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
      InputText.flex-grow(v-model="pronouns" label="pronouns")
    BasicButton.block.ml-auto(@click="$emit('next')") Next
</template>

<script>
  import names from '~/data/names.json';
  import { getRandomNumber } from '~/helpers/dice';

  export default {
    name: 'BuilderStep7',
    data() {
      return {
        experience1: '',
        experience2: '',
        name: '',
        pronouns: '',
        firstNames: names.first,
        familyNames: names.family,
      };
    },
    methods: {
      generateName() {
        const firstIndex = getRandomNumber(0, names.first.length - 1);
        const familyIndex = getRandomNumber(0, names.family.length - 1);

        this.name = `${names.first[firstIndex]} ${names.family[familyIndex]}`;
      },
    },
  };
</script>
