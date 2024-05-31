<template lang="pug">
  .flex.flex-col.flex-grow
    transition(name="fade" mode="out-in")
      //- new tier selections
      .flex.flex-col.p-6.flex-grow(v-if="showNewTierOptions")
        .space-y-4
          p.text-xl.font-bold Proficiency increases by +1
          .space-y-2
            p.text-xl.font-bold Gain a New Experience
            .flex.items-center.space-x-4
              p.text-2xl.font-bold +1
              InputText.flex-grow(v-model="newExperience")
        .pt-6.mt-auto
          BasicButton.w-full(:disabled="newExperience === ''" @click="saveNewTierOptions") Next
      //- tier options
      .flex.flex-col.p-6.overflow-hidden.flex-grow(
        v-else-if="showTierOptions"
        @submit="saveTierOptions"
      )
        .flex.justify-center.items-center.space-x-4.shrink-0
          button.flex.text-xl(
            :disabled="currentTab === 0"
            :class="{ 'opacity-30': currentTab === 0 }"
            @click="prev"
          )
            span.sr-only Tier {{ Math.max(currentTab, 1) }}
            NuxtIcon(name="chevron-left")
          h3.text-xl.font-bold.uppercase Tier {{ currentTab + 1 }}
          button.flex.text-xl(
            :disabled="currentTab >= 2"
            :class="{ 'opacity-30': currentTab >= 2 }"
            @click="next"
          )
            span.sr-only Tier {{ Math.min(currentTab + 2, 3) }}
            NuxtIcon(name="chevron-right")
        .shrink-0(v-if="tierChoices.length > 0")
          Swiper.tier-carousel(
            :items-to-show="1"
            :centered-slides="true"
            :auto-height="true"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
          )
            SwiperSlide(v-for="tier in 3")
              .m-2
                .py-1(v-for="(upgrade, index) in levelingData[`tier${tier}`].upgrades")
                  .flex.space-x-2
                    .option-checkboxes.pt-1.flex.justify-end.items-start.flex-shrink-0
                      InputCheckboxCounter(
                        v-model="tierChoices[tier - 1][index]"
                        :max="upgrade.max"
                        :enabled="choicesAvailable(tier, index, upgrade)"
                        :increment="upgrade.increase.multiclass ? 2 : 1"
                      )
                    .flex-grow.space-y-2
                      p {{ upgrade.description }}
                      .space-y-2(v-for="n in upgrade.max")
                        Transition(
                          name="slide-fade-left"
                          @enter="refreshSwiper"
                          @after-leave="refreshSwiper"
                        )
                          div(
                            :key="n"
                            v-if="Array.isArray(tierOptions[tier - 1][index]) && tierChoices[tier - 1][index] >= n"
                          )
                            InputChecklist(
                              v-if="upgrade.quantity && upgrade.quantity > 1"
                              v-model="tierOptionSelections[tier - 1][index][n - 1]"
                              :cols="upgrade.increase.trait ? 2 : 1"
                              :max="upgrade.quantity"
                              :options="tierOptions[tier - 1][index]"
                              :disabled="upgrade.increase.trait ? selectedTraits : []"
                            )
                            InputSelect(
                              v-else
                              v-model="tierOptionSelections[tier - 1][index][n - 1]"
                              :options="tierOptions[tier - 1][index]"
                            )
        .pt-6.mt-auto.shrink-0
          BasicButton.w-full(:disabled="choicesMade.length < 2" @click="saveTierOptions") Next
      //- fanfare
      .absolute.transform(
        v-else
        class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      )
        h2.text-6xl.text-center.uppercase.whitespace-nowrap.leveling__title
          | Level <strong>{{ character.level + 1 }}</strong>
</template>

<script>
  import confetti from 'canvas-confetti';

  import { uuidv4 } from '~/helpers/utility';
  import { getOptionsByUpgrade, newUpgrade } from '~/helpers/character';
  import { useCharactersStore } from '~/stores/characters';

  import GENERAL from '~/data/general';
  import CLASSES from '~/data/classes';

  export default {
    name: 'SheetLeveling',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      const newLevel = this.character.level + 1;
      const reachedNewTier = [2, 5, 8].includes(newLevel);
      const { tier1, tier2, tier3 } = CLASSES[this.character.baseClass];
      const levelingData = { tier1, tier2, tier3 };

      // current tab
      let currentTab = 0;
      if (newLevel > 4) {
        currentTab = newLevel > 7 ? 2 : 1;
      }

      return {
        currentTab,
        newLevel,
        reachedNewTier,
        levelingData,
        loaded: false, // TODO: set to false initially
        introDuration: 5200,
        swiper: null,
        newExperience: '',
        addExperience: null,
        existingChoices: [],
        tierChoices: [],
        tierOptions: [],
        tierOptionSelections: [],
      };
    },
    computed: {
      awaitingNewTierSelection() {
        return this.addExperience === null;
      },
      showNewTierOptions() {
        return this.awaitingNewTierSelection && this.loaded;
      },
      showTierOptions() {
        return !this.awaitingNewTierSelection && this.loaded;
      },
      choicesRemaining() {
        const selectedChoices = this.tierChoices.reduce((acc, current) => {
          return acc + current.reduce((p, c) => (p + c));
        }, 0);

        return Math.max(0, 2 - selectedChoices);
      },
      tierEnabled() {
        return {
          1: true,
          2: this.newLevel > 4,
          3: this.newLevel > 7,
        }
      },
      selectedTraits() {
        const chosenTraits = [];
        const traitOptionIndex = 0; // traits are always the first option in each tier

        // check character upgrades first
        if (!this.reachedNewTier) {
          for (let i = 0, j = GENERAL.traits.length; i < j; i++) {
            if (this.character[GENERAL.traits[i]].upgraded === true) {
              chosenTraits.push(GENERAL.traits[i]);
            }
          }
        }

        // TODO: reconcile this with existing choices;
        //       we will need to start i after any pre-existing choiced
        for (let tier = 0; tier < 3; tier++) {
          for (let i = 0, j = this.tierChoices[tier][traitOptionIndex]; i < j; i++) {
            this.tierOptionSelections[tier][traitOptionIndex][i].forEach((selection) => {
              chosenTraits.push(selection);
            });
          }
        }

        return chosenTraits;
      },
      choicesMade() {
        const complexUpgrades = ['trait', 'experience'];
        const selections = [];

        this.tierChoices.forEach((tierChoices, tierIndex) => {
          const tier = tierIndex + 1;

          tierChoices.forEach((choice, choiceIndex) => {
            if (choice > 0) {
              // user has selected this option, gather the data and push to selections[]
              const upgrade = this.levelingData[`tier${tier}`].upgrades[choiceIndex];
              const upgradeOptions = Object.keys(upgrade.increase);
              const [ firstOption ] = upgradeOptions;

              // check each choice made for this tier
              // TODO: this will have to take into account choices made from previous levels
              for (let i = 0; i < choice; i++) {
                // TODO: handle multiclass and subclass options separately
                // complex upgrades
                if (complexUpgrades.includes(firstOption)) {
                  if (this.tierOptionSelections[tierIndex][choiceIndex][choice - 1].length >= upgrade.quantity) {
                    selections.push(newUpgrade({
                      id: upgrade.id,
                      level: this.newLevel,
                      type: firstOption,
                      value: upgrade.increase[firstOption],
                      options: [ ...this.tierOptionSelections[tierIndex][choiceIndex][choice - 1] ],
                    }));
                  }
                // single option upgrades
                } else if (upgradeOptions.length === 1) {
                  selections.push(newUpgrade({
                    id: upgrade.id,
                    level: this.newLevel,
                    type: firstOption,
                    value: upgrade.increase[firstOption],
                  }));
                // choice upgrades
                } else if (upgradeOptions.length > 1) {
                  if (this.tierOptionSelections[tierIndex][choiceIndex][choice - 1]) {
                    selections.push(newUpgrade({
                      id: upgrade.id,
                      level: this.newLevel,
                      type: this.optionSelections[tierIndex][choiceIndex][choice - 1],
                      value: upgrade.increase[firstOption],
                    }));
                  }
                }
              }
            }
          });
        });

        return selections;
      },
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    mounted() {
      confetti({
        particleCount: 200,
        angle: 90,
        spread: 90,
      });

      setTimeout(() => {
        this.loaded = true;
      }, this.introDuration);

      // NOTE: If we generate this before adding a new experience,
      //       player will be unable to increase that experience
      //       during new tier level-up
      if (!this.reachedNewTier) this.generateChoicesData();
    },
    methods: {
      next() {
        this.swiper.slideTo(Math.min(this.currentTab + 1, 2));
      },
      prev() {
        this.swiper.slideTo(Math.max(this.currentTab - 1, 0));
      },
      onSwiper(swiper) {
        this.swiper = swiper;
      },
      onSlideChange(swiper) {
        this.currentTab = swiper.activeIndex;
      },
      refreshSwiper() {
        this.swiper.updateAutoHeight(300);
      },
      saveNewTierOptions() {
        this.addExperience = { id: uuidv4(), score: 1, name: this.newExperience };
        this.$nextTick(() => this.generateChoicesData());
      },
      choicesAvailable(tier, index, upgrade) {
        // TODO: use upgrade data to restrict based on multiclass/subclass selections

        return this.tierEnabled[tier]
          ? this.choicesRemaining + this.tierChoices[tier - 1][index]
          : 0;
      },
      generateChoicesData() {
        const tier1Choices = [];
        const tier2Choices = [];
        const tier3Choices = [];

        const tier1Options = [];
        const tier2Options = [];
        const tier3Options = [];

        const tier1OptionSelections = [];
        const tier2OptionSelections = [];
        const tier3OptionSelections = [];

        const existingTier1Choices = [];
        const existingTier2Choices = [];
        const existingTier3Choices = [];

        this.levelingData.tier1.upgrades
          .forEach((upgrade) => {
            const options = getOptionsByUpgrade(upgrade, this.character);
            const [ firstOption ] = options;
            const optionSelections = Array.from(Array(upgrade.max)).map(() => {
              return upgrade.quantity && upgrade.quantity > 1 ? [] : firstOption.value;
            }); // TODO: reconcole with existing choices

            // add the new experience to selection options, if applicable
            if (upgrade.increase.experience && this.addExperience) {
              options.push({
                label: this.addExperience.name,
                value: this.addExperience.id,
              });
            }

            tier1Choices.push(0); // TODO: reconcile with existing choices
            tier1Options.push(options);
            tier1OptionSelections.push(optionSelections);
            existingTier1Choices.push(0); // TODO: reconcile with existing choices
          });

        this.levelingData.tier2.upgrades
          .forEach((upgrade) => {
            const options = getOptionsByUpgrade(upgrade, this.character);
            const [ firstOption ] = options;
            const optionSelections = Array.from(Array(upgrade.max)).map(() => {
              return upgrade.quantity && upgrade.quantity > 1 ? [] : firstOption.value;
            }); // TODO: reconcole with existing choices

            // add the new experience to selection options, if applicable
            if (upgrade.increase.experience && this.addExperience) {
              options.push({
                label: this.addExperience.name,
                value: this.addExperience.id,
              });
            }

            tier2Choices.push(0); // TODO: reconcile with existing choices
            tier2Options.push(options);
            tier2OptionSelections.push(optionSelections);
            existingTier2Choices.push(0); // TODO: reconcile with existing choices
          });

        this.levelingData.tier3.upgrades
          .forEach((upgrade) => {
            const options = getOptionsByUpgrade(upgrade, this.character);
            const [ firstOption ] = options;
            const optionSelections = Array.from(Array(upgrade.max)).map(() => {
              return upgrade.quantity && upgrade.quantity > 1 ? [] : firstOption.value;
            }); // TODO: reconcole with existing choices

            // add the new experience to selection options, if applicable
            if (upgrade.increase.experience && this.addExperience) {
              options.push({
                label: this.addExperience.name,
                value: this.addExperience.id,
              });
            }

            tier3Choices.push(0); // TODO: reconcile with existing choices
            tier3Options.push(options);
            tier3OptionSelections.push(optionSelections);
            existingTier3Choices.push(0); // TODO: reconcile with existing choices
          });

        this.tierChoices = [
          [ ...tier1Choices ],
          [ ...tier2Choices ],
          [ ...tier3Choices ],
        ];

        this.tierOptions = [
          [ ...tier1Options ],
          [ ...tier2Options ],
          [ ...tier3Options ],
        ];

        this.tierOptionSelections = [
          [ ...tier1OptionSelections ],
          [ ...tier2OptionSelections ],
          [ ...tier3OptionSelections ],
        ],

        this.existingChoices = [
          [ ...existingTier1Choices ],
          [ ...existingTier2Choices ],
          [ ...existingTier3Choices ],
        ];
      },
      saveTierOptions() {
        console.log('>>> saveTierOptions');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .tier-carousel {
    overflow: visible;
  }

  .leveling__title {
    transform-style: preserve-3d;
    transform: translate3d(0,0,0);
    animation: OpeningSequence 5.2s linear forwards
  }

  @keyframes OpeningSequence {
    0% {
      text-shadow: 0 0 50px #fff;
      letter-spacing: 80px;
      opacity: 0.2;
      transform: rotateY(-90deg);
    }
    50% {
      text-shadow: 0 0 1px #fff;
      letter-spacing: 14px;
      opacity: 0.8;
      transform: rotateY(0deg);
    }
    85% {
      text-shadow: 0 0 1px #fff;
      opacity: 0.8;
      transform: rotateY(0deg) translateZ(100px);
    }
    100% {
      text-shadow: 0 0 10px #fff;
      opacity: 0;
      transform: translateZ(130px);
      pointer-events: none;
    }
  }

  .option-checkboxes {
    width: 72px;
  }
</style>
