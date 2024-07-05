<template lang="pug">
  BasicCard
    .space-y-6
      InputText(v-model="name" label="Name" @input="saveName")
      p.text-2xl {{ character.community }} {{ character.ancestry.join(' / ') }}
      p.text-2xl {{ classLabel }}
      p.text-2xl(v-if="multiclassLabel") {{ multiclassLabel }}
      .flex.space-x-4
        .w-10.flex.flex-col.items-center(v-for="domain in domains")
          NuxtIcon.text-5xl(:name="domain")
          p.text-xs.text-slate-600.uppercase.-translate-y-2 {{ domain }}
      InputTextarea(
        v-model="description"
        label="Description"
        @input="saveDescription"
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
        name: this.character.name,
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
      multiclassUpgrade() {
        return this.character.levelSelections
          .find((selection) => selection.type === 'multiclass');
      },
      classLabel() {
        const [ subclass ] = this.character.subclass;

        return `${subclass} ${this.character.baseClass}`;
      },
      multiclassLabel() {
        const [ _, subclass ] = this.character.subclass;

        return this.multiclassUpgrade && subclass
          ? `${subclass} ${this.multiclassUpgrade.options.class}`
          : null;
      },
      domains() {
        const domains = [ ...this.classData.domains ];

        if (this.multiclassUpgrade) domains.push(this.multiclassUpgrade.options.domain);

        return domains;
      },
    },
    methods: {
      saveName: debounce(function () {
        this.character.name = this.name;
        this.charactersStore.saveCharacter(this.character);
      }),
      saveDescription: debounce(function () {
        this.character.description = this.description;
        this.charactersStore.saveCharacter(this.character);
      }),
    },
  };
</script>
