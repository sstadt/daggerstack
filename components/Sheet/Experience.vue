<template lang="pug">
  BasicCard(title="Experience")
    button.w-full.flex.space-x-2.justify-between.text-xl.py-4.border-b(
      v-for="(experience, index) in experiences"
      @click="showBonuses(index)"
    )
      p {{ experience.name }}
      p +{{ experience.score }}
    InputCheckboxCounter.py-4(
      label="hope"
      helper-text="Spend hope to use experience or help an ally"
      v-model="hope"
      :enabled="maxHope"
      :max="Math.max(maxHope, baseMaxHope)"
    )
    p(v-if="baseClass")
      strong {{ ucFirst(character.baseClass) }}'s Hope:
      |  {{ baseClass.hopeAbility }}
    SheetBonuses(
      ref="bonuses"
      statistic="experience"
      :title="selectedExperience"
      :bonuses="experienceBonuses[selectedBonusesIndex]"
    )
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
        baseMaxHope: GENERAL.maxHope,
        selectedBonusesIndex: 0,
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
      hopeModifiers() {
        const characterModifiers = getFeaturesByAttribute(this.character, 'hopeSlot');
        const companionModifiers = this.character.companion.name
          ? getFeaturesByAttribute(this.character.companion, 'hopeSlot')
          : [];
        return characterModifiers.concat(companionModifiers);
      },
      maxHope() {
        return this.baseMaxHope + calculateModifiers(this.hopeModifiers, 'hopeSlot');
      },
      experienceBonuses() {
        return this.character.experience.map((exp) => {
          const experience = { ...exp };
          const bonuses = [];

          // level selections
          this.character.levelSelections
            .filter((selection) => {
              return selection.type === 'experience' && selection.options.includes(experience.id);
            })
            .forEach((selection) => {
              bonuses.push({
                name: `Level ${selection.level} (selection)`,
                modify: {
                  experience: selection.value,
                }
              });
            });

          // items
          if (this.character.inventory) {
            this.character.inventory.items
              .filter((item) => {
                return item.modify &&
                  item.modify.experience &&
                  item.options &&
                  item.options.experience === experience.id;
              })
              .forEach((item) => {
                bonuses.push({
                  name: item.name,
                  modify: {
                    experience: item.modify.experience,
                  }
                });
              });
          }

          // status effects
          if (this.character.buffs) {
            this.character.buffs
              .filter((buff) => (buff.enabled && buff.modify[`experience-${experience.id}`]))
              .forEach((buff) => {
                bonuses.push({
                  name: buff.name,
                  modify: {
                    experience: buff.modify[`experience-${experience.id}`],
                  }
                });
              });
          }

          return bonuses;
        });
      },
      selectedExperience() {
        return this.experiences[this.selectedBonusesIndex]
          ? this.experiences[this.selectedBonusesIndex].name
          : null;
      },
      experiences() {
        return this.character.experience.map((exp, index) => {
          const experience = { ...exp };

          experience.score = this.experienceBonuses[index].reduce((acc, curr) => {
            return acc + curr.modify.experience;
          }, experience.score);

          return experience;
        });
      },
    },
    methods: {
      ucFirst,
      showBonuses(index) {
        this.selectedBonusesIndex = index;
        this.$nextTick(() => {
          this.$refs.bonuses.open();
        });
      },
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
