<template lang="pug">
  .container.p-8
    form(@submit.prevent="next").space-y-8
      .space-y-4
        div
          h2.text-center.text-2xl.font-black.uppercase Experience
          p.text-center.mb-2.px-6.text-sm.text-slate-500 Describe two experiences, that make sense for your background, in a word or phrase
        .flex
          p.experience__label.px-4.text-lg.font-bold +2
          InputText.flex-grow(
            v-model="experience1"
            :errors="v$.experience1.$errors"
            required
          )
        .flex
          p.experience__label.px-4.text-lg.font-bold +1
          InputText.flex-grow(
            v-model="experience2"
            :errors="v$.experience2.$errors"
            required
          )
      .space-y-4
        h2.text-center.text-2xl.font-black.uppercase Identity
        .flex
          InputText.flex-grow(
            v-model="name"
            label="name"
            :errors="v$.name.$errors"
            required
          )
          button.u-inline-button.bg-slate-100.px-4.ml-1.flex.items-center.justify-center.border-l-white(@click="generateName")
            NuxtIcon.text-2xl(name="d20")
            .sr-only Generate random name
        InputText.flex-grow(
          v-model="pronouns"
          label="pronouns"
          :errors="v$.pronouns.$errors"
          required
        )
      BasicButton.block.ml-auto(type="submit") Next
</template>

<script>
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  import names from '~/data/names.json';
  import { getRandomNumber } from '~/helpers/dice';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep7',
    data() {
      const { name, pronouns, experience } = this.builderStore.character;

      let experience1 = '';
      let experience2 = '';

      experience.forEach((exp) => {
        if (exp.score === 2) experience1 = exp.name;
        if (exp.score === 1) experience2 = exp.name;
      });

      return {
        experience1,
        experience2,
        name,
        pronouns,
        firstNames: names.first,
        familyNames: names.family,
      };
    },
    validations() {
      return {
        name: { required },
        pronouns: { required },
        experience1: { required },
        experience2: { required },
      };
    },
    setup() {
      const builderStore = useBuilderStore();

      return {
        builderStore,
        v$: useVuelidate(),
      };
    },
    methods: {
      generateName() {
        const firstIndex = getRandomNumber(0, names.first.length - 1);
        const familyIndex = getRandomNumber(0, names.family.length - 1);

        this.name = `${names.first[firstIndex]} ${names.family[familyIndex]}`;
      },
      async next() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          this.builderStore.updateCharacter({
            name: this.name,
            pronouns: this.pronouns,
            experience: [
              { name: this.experience1, score: 2 },
              { name: this.experience2, score: 1 },
            ],
          });

          this.$emit('next');
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .experience__label {
    height: 44px;
    line-height: 44px;
  }
</style>
