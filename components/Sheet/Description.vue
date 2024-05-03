<template lang="pug">
  BasicCard(title="Description")
    .space-y-6.mt-6
      p.text-2xl {{ character.community }} {{ character.ancestry }}
      .flex.space-x-4
        .w-10.flex.flex-col.items-center(v-for="domain in domains")
          NuxtIcon.text-5xl(:name="domain")
          p.text-xs.text-slate-600.uppercase.-translate-y-2 {{ domain }}
      InputTextarea(
        v-model="description"
        label="Description"
        @input="saveDescription"
        hide-label
      )
</template>

<script>
  import CLASSES from '~/data/classes';

  import { debounce } from '~/helpers/utility';

  import { useCharactersStore } from '~/stores/characters';

  export default {
    name: 'SheetAppearance',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        description: this.character.description,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      classData() {
        return CLASSES[this.character.baseClass];
      },
      domains() {
        return this.classData.domains;
      },
    },
    methods: {
      saveDescription: debounce(function () {
        this.character.description = this.description;
        this.charactersStore.saveCharacter(this.character);
      }),
    },
  };
</script>
