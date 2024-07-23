<template lang="pug">
  BasicCard(title="Experience")
    .flex.space-x-2.justify-between.text-xl.py-4.border-b(
      v-for="experience in experiences"
    )
      p {{ experience.name }}
      p +{{ experience.score }}
    InputCheckboxCounter.py-4(
      label="hope"
      helper-text="Spend hope to use experience or help an ally"
      v-model="hope"
      :max="maxHope"
    )
    p(v-if="baseClass")
      strong {{ ucFirst(character.baseClass) }}'s Hope:
      |  {{ baseClass.hopeAbility }}
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';

  import { calculateModifiers, getFeaturesByAttribute } from '~/helpers/character';
  import { ucFirst } from '~/helpers/string';

  import GENERAL from '~/data/general';
  import CLASSES from '~/data/classes';

  export default {
    name: 'SheetExperience',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        hope: this.character.hope,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      baseClass() {
        return this.character.baseClass
          ? CLASSES[this.character.baseClass]
          : null;
      },
      maxHope() {
        const base = GENERAL.maxHope;
        const modifiers = this.character.companion.name
          ? getFeaturesByAttribute(this.character.companion, 'hopeSlot')
          : [];

        return base + calculateModifiers(modifiers, 'hopeSlot');
      },
      experiences() {
        return this.character.experience.map((exp) => {
          const experience = { ...exp };
          const bonus = this.character.levelSelections
            .filter((selection) => {
              return selection.type === 'experience' && selection.options.includes(experience.id);
            })
            .reduce((acc, curr) => {
              return acc + curr.value;
            }, 0);
          const itemBonus = this.character.inventory
            ? this.character.inventory.items
                .filter((item) => {
                  return item.modify &&
                    item.modify.experience &&
                    item.options &&
                    item.options.experience === experience.id;
                })
                .reduce((acc, curr) => acc + curr.modify.experience, 0)
            : 0;

          experience.score = experience.score + bonus + itemBonus;

          return experience;
        });
      },
    },
    methods: {
      ucFirst,
    },
    watch: {
      hope(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.character.hope = newVal;
          this.charactersStore.saveCharacter(this.character);
        }
      },
    },
  };
</script>
