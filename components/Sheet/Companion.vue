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
              priority="secondary"
              class="top-1/2 -translate-y-1/2"
              icon
              @click="openEditor"
            )
              .sr-only Edit Companion
              NuxtIcon(name="cog")
          p.text-center.text-slate-500 {{ character.companion.species }}
        .px-3.flex.items-center
          TraitDisplay.px-2.shrink-0(
            title="evasion"
            class="w-1/3"
            :score="character.companion.evasion"
          )
          .flex.flex-col.justify-center.flex-grow.space-y-2.pl-4
            p.text-xl <strong>Traits:</strong> {{ character.companion.traits.join(', ') }}
            p.text-xl <strong>Damage:</strong> {{ character.companion.damage }}
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
    BasicDrawer(ref="companionEditor" title="Companion")
      form.space-y-8.px-8.pb-8(@submit.prevent="saveCompanion")
        InputText(label="name" v-model="companionName")
        InputText(label="species" v-model="companionSpecies")
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
          .flex.items-center.space-x-4
            p.text-2xl.font-bold +{{ experience1Score }}
            InputText.flex-grow(
              v-model="experience1"
              :errors="v$.experience1.$errors"
              required
            )
          .flex.items-center.space-x-4
            p.text-2xl.font-bold +{{ experience2Score }}
            InputText.flex-grow(
              v-model="experience2"
              :errors="v$.experience2.$errors"
              required
            )
        BasicButton.w-full(type="submit" :disabled="!maxTraitsSelected") Save
</template>

<script>
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  import { useCharactersStore } from '~/stores/characters';
  import { ucFirst } from '~/helpers/string';

  import GENERAL from '~/data/general';

  export default {
    name: 'SheetCompanion',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      let [ existingExperience1, existingExperience2 ] = this.character.companion.experience
        ? this.character.companion.experience
        : [{ name: null, score: 2 }, { name: null, score: 1 }];

      return {
        traits: ['agility', 'strength', 'finesse', 'presence', 'instinct', 'knowledge'],
        companionName: this.character.companion.name,
        companionSpecies: this.character.companion.species,
        companionTraits: this.character.companion.traits,
        currentStress: this.character.companion.stress.current,
        maxStress: GENERAL.companionMaxStress,
        experience1: existingExperience1 ? existingExperience1.name : '',
        experience1Score: existingExperience1 ? existingExperience1.score : 2,
        experience2: existingExperience2 ? existingExperience2.name : '',
        experience2Score: existingExperience2 ? existingExperience2.score : 1,
      };
    },
    validations() {
      return {
        companionName: { required },
        companionSpecies: { required },
        experience1: { required },
        experience2: { required },
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
      maxTraitsSelected() {
        return this.companionTraits.length >= 2;
      },
      stressSlots() {
        // TODO: calculate with leveling bonuses
        return this.character.companion.stress.slots;
      },
    },
    methods: {
      ucFirst,
      openEditor() {
        this.$refs.companionEditor.open();
      },
      async saveCompanion() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          const companion = { ...this.character.companion };

          companion.name = this.companionName;
          companion.species = this.companionSpecies;
          companion.traits = [ ...this.companionTraits ];
          companion.experience = [
            { name: this.experience1, score: this.experience1Score },
            { name: this.experience2, score: this.experience2Score },
          ];

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
