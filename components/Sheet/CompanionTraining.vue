<template lang="pug">
  transition(name="fade")
    .px-8(v-if="optionsLoaded")
      div(v-for="(upgrade, index) in levelingData")
        .flex.space-x-2
          .option-checkboxes.pt-1.flex.justify-end.items-start.flex-shrink-0
            InputCheckboxCounter(
              v-model="choices[index]"
              :min="existingChoices[index]"
              :max="upgrade.max"
              :enabled="pointsRemaining + choices[index]"
            )
          .flex-grow.space-y-2
            BasicMarkdown(
              :source="upgrade.feature ? `**${upgrade.feature.title}:** ${upgrade.feature.description}` : upgrade.description"
            )
            .space-y-2(v-for="n in upgrade.max")
              Transition(name="slide-fade-left")
                .upgrade-options(
                  :key="n"
                  v-if="n > existingChoices[index] && Array.isArray(choiceOptions[index]) && choices[index] >= n"
                )
                  InputSelect(
                    v-model="choiceOptionSelections[index][n - 1]"
                    :options="choiceOptions[index]"
                    required
                  )
      BasicButton.w-full.mt-2(:disabled="!allChoicesMade" @click="saveTraining") Save
</template>

<script>
  import { newUpgrade } from '~/helpers/constructors';
  import { getOptionsByUpgrade } from '~/helpers/character';

  import COMPANION from '~/data/companion';

  export default {
    name: 'SheetCompanionTraining',
    props: {
      character: {
        type: Object,
        required: true,
      },
      pointsAvailable: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        levelingData: [ ...COMPANION.training ],
        choices: [],
        choiceOptions: [],
        choiceOptionSelections: [],
        existingChoices: [],
        optionsLoaded: false,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    mounted() {
      this.generateChoicesData();
    },
    computed: {
      choicesMade() {
        const selections = [];

        this.choices.forEach((choice, index) => {
          if (choice > this.existingChoices[index]) {
            const upgrade = this.levelingData[index];
            const upgradeOptions = (upgrade.increase) ? Object.keys(upgrade.increase) : [];
            const [ firstOption ] = upgradeOptions;

            // check each choice made for this option
            // skip existing choices
            for (let i = this.existingChoices[index]; i < choice; i++) {
              // feature upgrade
              if (upgrade.feature) {
                selections.push(newUpgrade({
                  id: upgrade.id,
                  type: 'feature',
                  options: { ...upgrade.feature },
                }));

              // experience
              } else if (upgrade.increase.experience) {
                selections.push(newUpgrade({
                  id: upgrade.id,
                  type: 'experience',
                  value: upgrade.increase.experience,
                  options: [ this.choiceOptionSelections[index][i] ],
                }));

              // multi-choice upgrade
              } else if (upgradeOptions.length > 1) {
                const selectedOption = this.choiceOptionSelections[index][i];

                selections.push(newUpgrade({
                  id: upgrade.id,
                  type: selectedOption,
                  value: upgrade.increase[selectedOption],
                }));

              // simple upgrade
              } else {
                selections.push(newUpgrade({
                  id: upgrade.id,
                  type: firstOption,
                  value: upgrade.increase[firstOption],
                }));
              }
            }
          }
        });

        return selections;
      },
      pointsRemaining() {
        return Math.max(this.pointsAvailable - this.choicesMade.length, 0)
      },
      allChoicesMade() {
        return this.pointsRemaining === 0;
      },
    },
    methods: {
      generateChoicesData() {
        const choices = [];
        const choiceOptions = [];
        const choiceOptionSelections = [];
        const existingChoices = [];

        COMPANION.training.forEach((upgrade) => {
          const numExisting = this.character.companion.levelSelections
            .filter((s) => s.id === upgrade.id).length;
          const options = getOptionsByUpgrade(upgrade, this.character.companion);
          const [ firstOption ] = options;
          const optionSelections = Array.from(Array(upgrade.max)).map(() => firstOption.value);

          choices.push(numExisting);
          choiceOptions.push(options);
          choiceOptionSelections.push(optionSelections);
          existingChoices.push(numExisting);
        });

        this.choices = choices;
        this.choiceOptions = choiceOptions;
        this.choiceOptionSelections = choiceOptionSelections;
        this.existingChoices = existingChoices;
        this.optionsLoaded = true;
      },
      saveTraining() {
        // add leveling choices to character
        this.choicesMade.forEach((choice) => {
          this.character.companion.levelSelections.push({ ...choice });
        });

        // save character
        this.charactersStore.saveCharacter(this.character);
        this.$emit('training-saved');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .option-checkboxes {
    width: 72px;
  }
</style>
