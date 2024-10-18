<template lang="pug">
  .companion
    transition(name="fade")
      .flex.justify-center(v-if="character.companion.name === null")
        BasicButton(@click="openEditor") Create Companion
      .space-y-6(v-else)
        div
          h2.text-center.text-2xl.font-black.uppercase.relative
            | {{ character.companion.name }}
            BasicButton.absolute.right-6.flex.items-center.justify-center(
              size="sm"
              :priority="companionConfigPriority"
              class="top-1/2 -translate-y-1/2"
              icon
              @click="openEditor"
            )
              .sr-only Edit Companion
              NuxtIcon(:name="companionConfigIcon")
          p.text-center.text-slate-500 {{ character.companion.species }}
        .px-3.flex.items-center
          TraitDisplay.px-2.shrink-0(
            title="evasion"
            class="w-1/3"
            :score="evasion"
          )
          .flex.flex-col.justify-center.flex-grow.space-y-2.pl-4
            p.text-xl <strong>Traits:</strong> {{ character.companion.traits.join(', ') }}
            p.text-xl <strong>Damage:</strong> {{ damage }} ({{ range }})
            .h-px.border-b(class="w-2/3")
            .stress.flex
              h3.text-lg.font-bold.uppercase.w-20.flex-shrink-0 stress
              InputCheckboxCounter(
                v-model="currentStress"
                :max="maxStress"
                :enabled="stressSlots"
              )
        BasicCard(title="experience")
          .flex.space-x-2.justify-between.text-xl.py-4(
            v-for="(experience, index) in companionExperience"
            :class="{ 'border-t': index !== 0 }"
          )
            p {{ experience.name }}
            p +{{ experience.score }}
        BasicCard(title="features")
          .space-y-2.py-4
            BasicMarkdown(
              v-for="feature in companionFeatures"
              :source="`**${ucFirst(feature.title)}:** ${feature.description}`"
            )
    BasicDrawer(ref="companionTraining" title="Training")
      SheetCompanionTraining(
        :character="character"
        :points-available="trainingPointsAvailable"
        @training-saved="closeTraining"
      )
    BasicDrawer(ref="companionEditor" title="Companion")
      form.space-y-8.px-8.pb-8(@submit.prevent="saveCompanion")
        InputText(
          label="name"
          v-model="companionName"
          :errors="v$.companionName.$errors"
        )
        InputText(
          label="species"
          v-model="companionSpecies"
          :errors="v$.companionSpecies.$errors"
        )
        .grid.grid-cols-2.gap-4
          InputCheckbox(
            v-for="trait in traits"
            :value="trait"
            :label="ucFirst(trait)"
            v-model="companionTraits"
            :disabled="maxTraitsSelected && !companionTraits.includes(trait)"
          )
        .space-y-4
          h2.text-center.text-2xl.font-black.uppercase Experience
          .flex.items-center.space-x-4(v-for="(experience, index) in experiences")
            p.text-2xl.font-bold +{{ companionExperience[index] ? companionExperience[index].score : experience.score }}
            InputText.flex-grow(
              v-model="experience.name"
              :errors="v$.experiences.$each.$response.$errors[index].name"
              required
            )
          transition(name="slide-fade-left")
            p.text-sm(v-if="newExperiences") <strong>Example Experiences:</strong> {{ exampleExperience }}
        BasicButton.w-full(type="submit" :disabled="!companionValid") Save
</template>

<script>
  export default {
    name: 'SheetCompanion',
  };
</script>

<script setup>
  import { useVuelidate } from '@vuelidate/core';
  import { helpers, required } from '@vuelidate/validators';

  import { useCharactersStore } from '~/stores/characters';
  import { uuidv4 } from '~/helpers/utility';
  import { ucFirst } from '~/helpers/string';

  import GENERAL from '~/data/general';
  import COMPANION from '~/data/companion';

  const charactersStore = useCharactersStore();

  const { getFeaturesByAttribute, calculateModifiers } = useSheetBonuses();

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const traits = ref([ ...GENERAL.traits ]);
  const maxStress = ref(GENERAL.companionMaxStress);
  const exampleExperience = ref(COMPANION.exampleExperience);
  const companionName = ref(props.character.companion.name);
  const companionSpecies = ref(props.character.companion.species);
  const companionTraits = ref(props.character.companion.traits);
  const currentStress = ref(props.character.companion.stress.current);
  const experiences = ref([ ...props.character.companion.experience ]);
  const companionEditor = ref(null);
  const companionTraining = ref(null);

  if (props.character.companion.experience.length < props.character.experience.length) {
    for (let i = props.character.companion.experience.length; i < props.character.experience.length; i++) {
      experiences.value.push({
        id: uuidv4(),
        name: null,
        score: 2,
      });
    }
  }

  const v$ = useVuelidate(
    {
      companionName: { required },
      companionSpecies: { required },
      experiences: {
        $each: helpers.forEach({
          name: { required },
        }),
      },
    },
    { companionName, companionSpecies, experiences },
  );

  const companionValid = computed(() => {
    return maxTraitsSelected.value &&
      !newExperiences.value &&
      companionName.value.length > 0 &&
      companionSpecies.value.length > 0;
  });

  const companionConfigIcon = computed(() => {
    return newTraining.value ? 'meat' : 'cog';
  });

  const companionConfigPriority = computed(() => {
    return newExperiences.value || newTraining.value ? 'primary' : 'secondary';
  });

  const maxTraitsSelected = computed(() => {
    return companionTraits.value.length >= 2;
  });

  const evasion = computed(() => {
    const base = props.character.companion.evasion;
    const modifiers = getFeaturesByAttribute(props.character.companion, 'companionEvasion');

    return base + calculateModifiers(modifiers, 'companionEvasion');
  });

  const stressSlots = computed(() => {
    const base = props.character.companion.stress.slots;
    const modifiers = getFeaturesByAttribute(props.character.companion, 'companionStressSlot');

    return base + calculateModifiers(modifiers, 'companionStressSlot');
  });

  const companionExperience = computed(() => {
    return props.character.companion.experience.map((experience) => {
      const exp = { ...experience };
      const upgrades = props.character.companion.levelSelections.filter(
        (selection) => selection.type === 'experience' && selection.options.includes(exp.id),
      ).length;

      exp.score = exp.score + upgrades;

      return exp;
    });
  });

  const companionFeatures = computed(() => {
    const features = [ ...COMPANION.features ];
    const trainedFeatures = props.character.companion.levelSelections
      .filter((selection) => selection.type === 'feature')
      .map(({ options }) => ({ ...options }));

    return features.concat(trainedFeatures);
  });

  const newExperiences = computed(() => {
    return experiences.value.filter(
      (experience) => experience.name === null || experience.name === '',
    ).length > 0;
  });

  const trainingPointsAvailable = computed(() => {
    const pointsSpent = props.character.companion.levelSelections.length;
    const trainingUpgrades = getFeaturesByAttribute(props.character, 'companionTraining');
    const bonusPoints = calculateModifiers(trainingUpgrades, 'companionTraining');
    const basePoints = props.character.level - 1;

    return Math.max(basePoints + bonusPoints - pointsSpent, 0);
  });

  const newTraining = computed(() => {
    return trainingPointsAvailable.value > 0;
  });

  const damage = computed(() => {
    const upgrades = props.character.companion.levelSelections.filter((selection) => {
      return selection.type === 'companionDamage';
    });

    return COMPANION.damage[upgrades.length];
  });

  const range = computed(() => {
    const upgrades = props.character.companion.levelSelections.filter((selection) => {
      return selection.type === 'companionRange';
    });

    return COMPANION.range[upgrades.length];
  });

  const openEditor = () => {
    if (companionValid.value && newTraining.value) {
      companionTraining.value.open();
    } else {
      companionEditor.value.open();
    }
  };

  const saveCompanion = async () => {
    const formValid = await v$.value.$validate();

    if (formValid) {
      const companion = { ...props.character.companion };

      companion.name = companionName.value;
      companion.species = companionSpecies.value;
      companion.traits = [ ...companionTraits.value ];
      companion.experience = [ ...experiences.value ];

      props.character.companion = { ...companion };
      charactersStore.saveCharacter(props.character);
      companionEditor.value.close();
    }
  };

  const closeTraining = () => {
    companionTraining.value.close();
  };

  watch(currentStress, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      props.character.companion.stress.current = newVal;
      charactersStore.saveCharacter(props.character);
    }
  });
</script>
