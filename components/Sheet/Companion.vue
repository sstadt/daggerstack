<template lang="pug">
  .companion
    transition(name="fade")
      .flex.justify-center(v-if="character.companion.name === null")
        BasicButton(@click="openEditor") Create Companion
      p(v-else) {{ character.companion.name }}
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
        BasicButton.w-full(type="submit") Save
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
  };
</script>
