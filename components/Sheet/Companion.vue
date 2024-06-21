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
            :score="character.companion.evasion"
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
            v-for="(experience, index) in character.companion.experience"
            :class="{ 'border-t': index !== 0 }"
          )
            p {{ experience.name }}
            p +{{ experience.score }}
        BasicCard(title="features")
          .space-y-2.py-4
            p.text-xl
              strong(class="mr-1.5") Actions:
              | You can make an action roll to command your companion using Instinct, and take advantage if they are using one of their companion traits.
            p.text-xl
              strong(class="mr-1.5") Attack:
              | If you command them to attack a target, on a success, their damage roll uses your proficiency and their damage dice.
            .space-y-2
              p.text-xl
                strong(class="mr-1.5") Stress:
                | Anytime your companion would take damage, they mark stress. When their stress slots are full, they drop out of the scene (hide, flee, etc). They are unavailable to you, and will return at your next long rest with one stress cleared.
              p.text-xl Whenever you use the Clear Stress downtime action on yourself, it automatically clears that much stress on your companion as well.
    BasicDrawer(ref="companionTraining" title="Training")
      SheetCompanionTraining(
        :character="character"
        :points-available="trainingPointsAvailable"
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
            p.text-2xl.font-bold +{{ experience.score }}
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
  import { useVuelidate } from '@vuelidate/core';
  import { helpers, required } from '@vuelidate/validators';

  import { useCharactersStore } from '~/stores/characters';
  import { uuidv4 } from '~/helpers/utility';
  import { calculateModifiers, getFeaturesByAttribute } from '~/helpers/character';
  import { ucFirst } from '~/helpers/string';

  import GENERAL from '~/data/general';
  import COMPANION from '~/data/companion';

  export default {
    name: 'SheetCompanion',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      const numCharacterExperience = this.character.experience.length;
      const numCompanionExperience = this.character.companion.experience.length;
      const experiences = [ ...this.character.companion.experience ];

      if (numCompanionExperience < numCharacterExperience) {
        for (let i = numCompanionExperience; i < numCharacterExperience; i++) {
          experiences.push({
            id: uuidv4(),
            name: null,
            score: i === 0 ? 2 : 1,
          });
        }
      }

      return {
        traits: [ ...GENERAL.traits ],
        maxStress: GENERAL.companionMaxStress,
        exampleExperience: COMPANION.exampleExperience,
        companionName: this.character.companion.name,
        companionSpecies: this.character.companion.species,
        companionTraits: this.character.companion.traits,
        currentStress: this.character.companion.stress.current,
        experiences,
      };
    },
    validations() {
      return {
        companionName: { required },
        companionSpecies: { required },
        experiences: {
          $each: helpers.forEach({
            name: { required },
          }),
        },
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return {
        charactersStore,
        v$: useVuelidate(),
      };
    },
    computed: {
      companionValid() {
        return this.maxTraitsSelected &&
          !this.newExperiences &&
          this.companionName.length > 0 &&
          this.companionSpecies.length > 0;
      },
      companionConfigIcon() {
        return this.newTraining ? 'meat' : 'cog';
      },
      companionConfigPriority() {
        return this.newExperiences || this.newTraining ? 'primary' : 'secondary';
      },
      maxTraitsSelected() {
        return this.companionTraits.length >= 2;
      },
      stressSlots() {
        // TODO: calculate with leveling bonuses
        return this.character.companion.stress.slots;
      },
      newExperiences() {
        return this.experiences.filter(
          (experience) => experience.name === null || experience.name === '',
        ).length > 0;
      },
      trainingPointsAvailable() {
        const pointsSpent = this.character.companion.levelSelections.length;
        const trainingUpgrades = getFeaturesByAttribute(this.character, 'companionTraining');
        const bonusPoints = calculateModifiers(trainingUpgrades, 'companionTraining');
        const basePoints = this.character.level - 1;

        return Math.max(basePoints + bonusPoints - pointsSpent, 0);
      },
      newTraining() {
        return this.trainingPointsAvailable > 0;
      },
      damage() {
        const upgrades = this.character.companion.levelSelections.filter((selection) => {
          return selection.type === 'companionDamage';
        });

        return COMPANION.damage[upgrades.length];
      },
      range() {
        const upgrades = this.character.companion.levelSelections.filter((selection) => {
          return selection.type === 'companionRange';
        });

        return COMPANION.range[upgrades.length];
      },
    },
    methods: {
      ucFirst,
      openEditor() {
        if (this.companionValid && this.newTraining && !this.newExperience) {
          this.$refs.companionTraining.open();
        } else {
          this.$refs.companionEditor.open();
        }
      },
      async saveCompanion() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          const companion = { ...this.character.companion };

          companion.name = this.companionName;
          companion.species = this.companionSpecies;
          companion.traits = [ ...this.companionTraits ];
          companion.experience = [ ...this.experiences ];

          this.character.companion = { ...companion };
          this.charactersStore.saveCharacter(this.character);
          this.$refs.companionEditor.close();
        }
      },
    },
    watch: {
      currentStress(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.character.companion.stress.current = newVal;
          this.charactersStore.saveCharacter(this.character);
        }
      },
    },
  };
</script>
