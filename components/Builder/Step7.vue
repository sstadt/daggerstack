<template lang="pug">
  .container.p-8
    form(@submit.prevent="next").space-y-8
      .space-y-4
        div
          h2.mb-2.text-center.text-2xl.font-black.uppercase Experience
          p.text-center.mb-2.px-6.text-sm.text-slate-500 Describe two experiences, that make sense for your background, in a word or phrase
          p.text-center.mb-2.px-6.text-sm.text-slate-500(v-if="bonusExperience > 0") Your character also has {{ bonusExperience }} extra experience to allocate as you choose!
        .flex
          InputCounter.mr-2(
            v-model="experience1Score"
            :min="2"
            :max="2 + remainingExperience"
            modifier
          )
          InputText.flex-grow(
            v-model="experience1"
            :errors="v$.experience1.$errors"
            required
          )
        .flex
          InputCounter.mr-2(
            v-model="experience2Score"
            :min="1"
            :max="1 + remainingExperience"
            modifier
          )
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
          button.u-inline-button.bg-slate-100.px-4.flex.items-center.justify-center(
            type="button"
            @click="generateName"
          )
            NuxtIcon.text-2xl(name="d20")
            .sr-only Generate random name
        InputText.flex-grow(
          v-model="pronouns"
          label="pronouns"
          :errors="v$.pronouns.$errors"
          required
        )
      .flex.justify-between.items-center
        NuxtLink(to="/") Finish Later
        BasicButton.block(type="submit") Next
</template>

<script>
  import { mapState } from 'pinia';
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  import NAMES from '~/data/names.json';
  import { uuidv4 } from '~/helpers/utility';
  import { getRandomNumber } from '~/helpers/dice';
  import { calculateModifiers, getFeaturesByAttribute } from '~/helpers/character';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep7',
    data() {
      const { name, pronouns, experience } = this.builderStore.character;
      const [ existingExperience1, existingExperience2 ] = experience;

      return {
        experience1: existingExperience1 ? existingExperience1.name : '',
        experience1Score: existingExperience1 ? existingExperience1.score : 2,
        experience2: existingExperience2 ? existingExperience2.name : '',
        experience2Score: existingExperience2 ? existingExperience2.score : 1,
        name,
        pronouns,
        firstNames: NAMES.first,
        familyNames: NAMES.family,
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
    computed: {
      ...mapState(useBuilderStore, ['character']),
      bonusExperience() {
        const modifiers = getFeaturesByAttribute(this.character, 'experience');
        return calculateModifiers(modifiers, 'experience');
      },
      remainingExperience() {
        const totalExperience = this.experience1Score + this.experience2Score;

        // 3 total is base for all characters, so we need to zero that out
        return 3 - totalExperience + this.bonusExperience;
      },
    },
    methods: {
      generateName() {
        const firstIndex = getRandomNumber(0, NAMES.first.length - 1);
        const familyIndex = getRandomNumber(0, NAMES.family.length - 1);

        this.name = `${NAMES.first[firstIndex]} ${NAMES.family[familyIndex]}`;
      },
      async next() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          this.builderStore.updateCharacter({
            name: this.name,
            pronouns: this.pronouns,
            experience: [
              { id: uuidv4(), name: this.experience1, score: this.experience1Score },
              { id: uuidv4(), name: this.experience2, score: this.experience2Score },
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
