<template lang="pug">
  .max-w-5xl.container.p-8
    form(@submit.prevent="next").space-y-8
      .space-y-4
        div
          h2.mb-2.text-center.text-2xl.font-black.uppercase Experience
          p.text-center.mb-2.px-6.text-sm.text-slate-500 Describe two experiences, that make sense for your background, in a word or phrase
          p.text-center.mb-2.px-6.text-sm.text-slate-500(v-if="bonusExperience > 0") Your character also has {{ bonusExperience }} extra experience to allocate as you choose!
        .flex
          InputCounter.mr-2.shrink-0(
            v-model="experience1Score"
            :min="2"
            :max="2 + remainingExperience"
            modifier
          )
          InputText.grow(
            v-model="experience1"
            :errors="v$.experience1.$errors"
            required
          )
        .flex
          InputCounter.mr-2.shrink-0(
            v-model="experience2Score"
            :min="2"
            :max="2 + remainingExperience"
            modifier
          )
          InputText.grow(
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
        NuxtLink(to="/character") Finish Later
        BasicButton.block(type="submit") Next
</template>

<script>
  export default {
    name: 'BuilderStep7',
  };
</script>

<script setup>
  import { mapState } from 'pinia';
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  import NAMES from '~/data/names.json';
  import { uuidv4 } from '~/helpers/utility';
  import { getRandomNumber } from '~/helpers/dice';

  const builderStore = useBuilderStore();
  const { getFeaturesByAttribute, calculateModifiers } = useSheetBonuses();

  const emit = defineEmits(['next']);

  // todo: need to populate this stuff on page load
  const name = ref('');
  const pronouns = ref('');
  const experience1 = ref('');
  const experience1Score = ref(2);
  const experience2 = ref('');
  const experience2Score = ref(2);

  const v$ = useVuelidate(
    {
      name: { required },
      pronouns: { required },
      experience1: { required },
      experience2: { required },
    },
    { name, pronouns, experience1, experience2 },
  );

  const bonusExperience = computed(() => {
    const modifiers = getFeaturesByAttribute(builderStore.character, 'experience');
    return calculateModifiers(modifiers, 'experience');
  });

  const remainingExperience = computed(() => {
    const totalExperience = experience1Score.value + experience2Score.value;

    // 4 total is base for all characters, so we need to zero that out
    return 4 - totalExperience + bonusExperience.value;
  });

  const generateName = () => {
    const firstIndex = getRandomNumber(0, NAMES.first.length - 1);
    const familyIndex = getRandomNumber(0, NAMES.family.length - 1);

    name.value = `${NAMES.first[firstIndex]} ${NAMES.family[familyIndex]}`;
  };

  const next = async () => {
    const formValid = await v$.value.$validate();

    if (formValid) {
      builderStore.updateCharacter({
        name: name.value,
        pronouns: pronouns.value,
        experience: [
          { id: uuidv4(), name: experience1.value, score: experience1Score.value },
          { id: uuidv4(), name: experience2.value, score: experience2Score.value },
        ],
      });

      emit('next');
    }
  };

  onMounted(() => {
    const [ exp1, exp2 ] = builderStore.character.experience;

    name.value = builderStore.character?.name || '';
    pronouns.value = builderStore.character?.pronouns || '';

    if (exp1) {
      experience1.value = exp1.name;
      experience1Score.value = exp1.score;
    }

    if (exp2) {
      experience2.value = exp2.name;
      experience2Score.value = exp2.score;
    }
  });
</script>

<style lang="scss" scoped>
  .experience__label {
    height: 44px;
    line-height: 44px;
  }
</style>
