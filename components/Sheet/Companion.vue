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
                :enabled="character.companion.stress.slots"
              )
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
        BasicButton.w-full(type="submit" :disabled="!maxTraitsSelected") Save
</template>

<script>
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  import { useCharactersStore } from '~/stores/characters';
  import { ucFirst } from '~/helpers/string';

  export default {
    name: 'SheetCompanion',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        traits: ['agility', 'strength', 'finesse', 'presence', 'instinct', 'knowledge'],
        companionName: this.character.companion.name,
        companionSpecies: this.character.companion.species,
        companionTraits: this.character.companion.traits,
        currentStress: this.character.companion.stress.current,
      };
    },
    validations() {
      return {
        companionName: { required },
        companionSpecies: { required },
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
      maxStress() {
        // TODO: calculate with leveling bonuses
        return 4;
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
