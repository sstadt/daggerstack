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
  export default {
    name: 'SheetExperience',
  };
</script>

<script setup>
  import { ucFirst } from '~/helpers/string';

  import GENERAL from '~/data/general';
  import CLASSES from '~/data/classes';

  const { getFeaturesByAttribute, calculateModifiers } = useSheetBonuses();

  const charactersStore = useCharactersStore();

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const hope = ref(props.character.hope);
  const baseMaxHope = ref(GENERAL.maxHope);
  const selectedBonusesIndex = ref(0);
  const bonuses = ref(null);

  const baseClass = computed(() => {
    return props.character.baseClass
      ? CLASSES[props.character.baseClass]
      : null;
  });

  const hopeModifiers = computed(() => {
    const characterModifiers = getFeaturesByAttribute(props.character, 'hopeSlot');
    const companionModifiers = props.character.companion.name
      ? getFeaturesByAttribute(props.character.companion, 'hopeSlot')
      : [];
    return characterModifiers.concat(companionModifiers);
  });

  const maxHope = computed(() => {
    return baseMaxHope.value + calculateModifiers(hopeModifiers.value, 'hopeSlot');
  });

  const experienceBonuses = computed(() => {
    return props.character.experience.map((exp) => {
      const experience = { ...exp };
      const bonuses = [];

      // level selections
      props.character.levelSelections
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
      if (props.character.inventory) {
        props.character.inventory.items
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
      if (props.character.buffs) {
        props.character.buffs
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
  });

  const selectedExperience = computed(() => {
    return experiences.value[selectedBonusesIndex.value]
      ? experiences.value[selectedBonusesIndex.value].name
      : null;
  });

  const experiences = computed(() => {
    return props.character.experience.map((exp, index) => {
      const experience = { ...exp };

      experience.score = experienceBonuses.value[index].reduce((acc, curr) => {
        return acc + curr.modify.experience;
      }, experience.score);

      return experience;
    });
  });

  const showBonuses = (index) => {
    selectedBonusesIndex.value = index;
    nextTick(() => {
      bonuses.value.open();
    });
  };

  watch(hope, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      props.character.hope = newVal;
      charactersStore.saveCharacter(props.character);
    }
  });
</script>
