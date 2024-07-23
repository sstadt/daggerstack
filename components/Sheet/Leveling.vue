<template lang="pug">
  .flex.flex-col.flex-grow
    transition(name="fade" mode="out-in")
      //- new tier selections
      .flex.flex-col.p-6.flex-grow(v-if="showNewTierOptions")
        .space-y-6
          .space-y-2
            h3.text-xl.font-bold.uppercase New Tier Upgrades
            p.text-xl.py-4 Your proficiency increases by +1
          .space-y-2
            h3.text-xl.font-bold.uppercase Gain a New Experience
            .flex.items-center.space-x-4.py-4
              p.text-2xl.font-bold +1
              InputText.flex-grow(v-model="newExperience")
        .pt-6.mt-auto
          BasicButton.w-full(:disabled="newExperience === ''" @click="saveNewTierOptions") Next
      //- tier options
      .flex.flex-col.p-6.overflow-hidden.flex-grow(
        v-else-if="showTierOptions"
        class="md:px-32"
      )
        .flex.justify-center.items-center.space-x-4.shrink-0
          button.flex.text-xl(
            :disabled="currentTierTab === 0"
            :class="{ 'opacity-30': currentTierTab === 0 }"
            @click="prev"
          )
            span.sr-only Tier {{ Math.max(currentTierTab, 1) }}
            NuxtIcon(name="chevron-left")
          h3.text-xl.font-bold.uppercase Tier {{ currentTierTab + 1 }}
          button.flex.text-xl(
            :disabled="currentTierTab >= 2"
            :class="{ 'opacity-30': currentTierTab >= 2 }"
            @click="next"
          )
            span.sr-only Tier {{ Math.min(currentTierTab + 2, 3) }}
            NuxtIcon(name="chevron-right")
        .shrink-0(v-if="tierChoices.length > 0")
          Swiper.tier-carousel(
            :items-to-show="mq.lg ? 3 : 1"
            :initial-slide="currentTierTab"
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
                        :min="existingChoices[tier - 1][index]"
                        :max="upgrade.max"
                        :enabled="getChoicesAvailable(tier, index, upgrade)"
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
                          //- Basic options
                          .upgrade-options(
                            :key="n"
                            v-if="n > existingChoices[tier - 1][index] && Array.isArray(tierOptions[tier - 1][index]) && tierChoices[tier - 1][index] >= n"
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
                          //- Multiclass options
                          .space-y-2(v-else-if="upgrade.increase.multiclass && tierChoices[tier - 1][index] > existingChoices[tier - 1][index] && n < 2")
                            InputSelect(
                              label="Class"
                              v-model="selectedMulticlass"
                              :options="multiclassOptions"
                              @input="refreshSwiper"
                              required
                            )
                            InputSelect(
                              label="Subclass"
                              v-model="selectedNewSubclass"
                              :options="newSubclassOptions"
                              :disabled="newSubclassOptions.length < 1"
                              required
                            )
                            InputSelect(
                              label="Domain"
                              v-model="selectedDomain"
                              :options="domainOptions"
                              :disabled="domainOptions.length < 1"
                              required
                            )
                            .space-y-2
                              div(v-for="feature in multiclassFeatures")
                                h3.font-bold.mb-px {{ feature.name }}
                                BasicMarkdown.text-sm(
                                  :source="feature.description"
                                  :space="1"
                                )
                          //- Subclass options
                          div(v-else-if="upgrade.increase.subclass && tierChoices[tier - 1][index] > existingChoices[tier - 1][index] && subclassOptions.length > 1")
                            InputSelect(
                              label="Subclass"
                              v-model="selectedSubclass"
                              :options="subclassOptions"
                              required
                            )
        .pt-6.mt-auto.shrink-0
          BasicButton.w-full(:disabled="!tierSelectionsFull" @click="saveTierOptions") Next
      //- confirm level
      .flex.flex-col.p-6.overflow-hidden.flex-grow(
        v-else-if="acceptTierChoices"
        @submit="saveLevelUp"
      )
        h3.text-xl.font-bold.uppercase(v-if="reachedNewTier") New Tier Upgrades
        .divide-y(v-if="reachedNewTier")
          p.text-xl.py-4 Proficiency increases by +1
          p.text-xl.py-4 New Experience: {{ addExperience.name }} +{{ addExperience.score }}
        h3.text-xl.font-bold.uppercase.mt-6 Upgrade Choices
        .divide-y
          p.text-xl.py-4(v-for="choice in choicesMade") {{ getChoiceLabel(choice) }}
        h3.text-xl.font-bold.uppercase.mt-6 Additional Tier Upgrades
        .divide-y
          p.text-xl.py-4(v-for="upgrade in levelingData[`${currentTier}`].always") {{ upgrade.description }}
        h3.text-xl.font-bold.uppercase.mt-6 Domain Cards
        p.text-xl.py-4 Choose a new Domain Deck card at your Level or lower. If your loadout is full, you may choose a card to swap.
        .pt-6.mt-auto.shrink-0
          BasicButton.w-full(@click="saveLevelUp") Level Up
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
  import { createSelectOptions } from '~/helpers/array';
  import { titleCase } from '~/helpers/string';

  import GENERAL from '~/data/general';
  import CLASSES from '~/data/classes';
  import SUBCLASSES from '~/data/subclasses';

  const CHOICES_PER_LEVEL = 2;

  export default {
    name: 'SheetLeveling',
    inject: ['mq'],
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      const [ firstClassOption ] = Object.keys(CLASSES)
        .filter((className) => className !== this.character.baseClass);
      const [ firstSubclassOption ] = SUBCLASSES[firstClassOption]
        .map((subclass) => subclass.name);
      const [ firstSubclass ] = this.character.subclass;
      const [ firstDomainOption ] = CLASSES[firstClassOption].domains
        .filter((domain) => !CLASSES[this.character.baseClass].domains.includes(domain));
      const { tier1, tier2, tier3 } = CLASSES[this.character.baseClass];
      const levelingData = { tier1, tier2, tier3 };

      return {
        currentTierTab: 0,
        levelingData,
        loaded: false,
        introDuration: 5200,
        swiper: null,
        newExperience: '',
        addExperience: null,
        existingChoices: [], // selections from previous levels
        tierChoices: [], // selections from current level up
        tierOptions: [], // upgrade line items
        tierOptionSelections: [], // options for line items (specific traits or choices on the same line)
        acceptTierChoices: false,
        multiclassInputKey: uuidv4(),
        selectedMulticlass: firstClassOption,
        selectedNewSubclass: firstSubclassOption,
        selectedDomain: firstDomainOption,
        selectedSubclass: firstSubclass,
      };
    },
    computed: {
      multiclassOptions() {
        const classes = Object.keys(CLASSES);
        const baseClassIndex = classes.findIndex((className) => className === this.character.baseClass);

        classes.splice(baseClassIndex, 1)

        return createSelectOptions(classes);
      },
      multiclassFeatures() {
        return [ ...CLASSES[this.selectedMulticlass].classFeatures ];
      },
      domainOptions() {
        const domains = [ ...CLASSES[this.selectedMulticlass].domains ]
          .filter((domain) => !CLASSES[this.character.baseClass].domains.includes(domain));

        return this.selectedMulticlass ? createSelectOptions(domains) : [];
      },
      // used for selecting a new subclass during multiclass selection
      newSubclassOptions() {
        const className = this.selectedMulticlass ? this.selectedMulticlass : null;
        const subclasses = className
          ? SUBCLASSES[className].map((subclass) => subclass.name)
          : [];

        return createSelectOptions(subclasses);
      },
      // used for selecting a subclass to apply upgrades to
      subclassOptions() {
        return createSelectOptions([ ...this.character.subclass ]);
      },
      newLevel() {
        return this.character.level + 1;
      },
      reachedNewTier() {
        return [2, 5, 8].includes(this.newLevel);
      },
      awaitingNewTierSelection() {
        return this.addExperience === null;
      },
      showNewTierOptions() {
        return this.reachedNewTier && this.awaitingNewTierSelection && this.loaded;
      },
      showTierOptions() {
        return !this.showNewTierOptions && !this.acceptTierChoices && this.loaded;
      },
      tierSelectionsFull() {
        return Boolean(
          this.choicesMade.length === 2 ||
          this.choicesMade.find((choice) => choice.type === 'multiclass')
        );
      },
      showConfirmLevel() {
        return this.acceptTierChoices && this.loaded;
      },
      choicesRemaining() {
        const totalChoices = this.character.level * CHOICES_PER_LEVEL;
        const selectedChoices = this.tierChoices.reduce((acc, current) => {
          return acc + current.reduce((p, c) => (p + c));
        }, 0);

        return Math.max(0, totalChoices - selectedChoices);
      },
      currentTier() {
        if (this.newLevel < 5) return 'tier1';
        if (this.newLevel < 8) return 'tier2';
        return 'tier3';
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

        // check existing trait choices
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

        // iterate over all tiers
        this.tierChoices.forEach((tierChoices, tierIndex) => {
          const tier = tierIndex + 1;

          // iterate over each choice in the tier
          tierChoices.forEach((choice, choiceIndex) => {
            // do nothing if there are no options, or if the only choices are from previous levels
            if (choice > this.existingChoices[tierIndex][choiceIndex]) {
              // user has selected this option, gather the data and push to selections[]
              const upgrade = this.levelingData[`tier${tier}`].upgrades[choiceIndex];
              const upgradeOptions = Object.keys(upgrade.increase);
              const [ firstOption ] = upgradeOptions;

              // check each choice made for this tier
              // skip existing choices
              for (let i = this.existingChoices[tierIndex][choiceIndex]; i < choice; i++) {
                // multiclass upgrades
                if (upgrade.increase.multiclass) {
                  if (!selections.find((selection) => selection.id === upgrade.id)) {
                    selections.push(newUpgrade({
                      id: upgrade.id,
                      level: this.newLevel,
                      type: 'multiclass',
                      value: 2, // TODO: do we need to care about this ??
                      options: {
                        class: this.selectedMulticlass,
                        subclass: this.selectedNewSubclass,
                        domain: this.selectedDomain,
                      },
                    }));
                  }
                // subclass upgrades
                } else if (upgrade.increase.subclass) {
                  selections.push(newUpgrade({
                    id: upgrade.id,
                    level: this.newLevel,
                    type: 'subclass',
                    value: this.selectedSubclass,
                  }));
                // upgrades that select multiple single value options
                } else if (complexUpgrades.includes(firstOption)) {
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
                      type: this.tierOptionSelections[tierIndex][choiceIndex][choice - 1],
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
      const sheetStore = useSheetStore();

      return { charactersStore, sheetStore };
    },
    mounted() {
      // if this is a new tier, allow the addition of a new experience
      if (this.newLevel > 7) {
        this.currentTierTab = 2;
      } else if (this.newLevel > 4) {
        this.currentTierTab = 1;
      }

      // fanfare
      if (this.sheetStore.settings.levelingFanfare) {
        confetti({
          particleCount: 200,
          angle: 90,
          spread: 90,
        });

        setTimeout(() => {
          this.loaded = true;
        }, this.introDuration);
      } else {
        this.$nextTick(() => {
          this.loaded = true;
        });
      }

      // NOTE: If we generate this before adding a new experience,
      //       player will be unable to increase that experience
      //       during new tier level-up
      if (!this.reachedNewTier) this.generateChoicesData();
    },
    watch: {
      selectedMulticlass() {
        const [ firstSubclassOption ] = SUBCLASSES[this.selectedMulticlass].map((subclass) => subclass.name);
        const [ firstDomainOption ] = CLASSES[this.selectedMulticlass].domains
          .filter((domain) => !CLASSES[this.character.baseClass].domains.includes(domain));

        // reset additional multiclass options
        this.selectedNewSubclass = firstSubclassOption;
        this.selectedDomain = firstDomainOption;

        // re-render selects to resync v-model
        this.$nextTick(() => {
          this.multiclassInputKey = uuidv4();
        });
      },
    },
    methods: {
      next() {
        this.swiper.slideTo(Math.min(this.currentTierTab + 1, 2));
      },
      prev() {
        this.swiper.slideTo(Math.max(this.currentTierTab - 1, 0));
      },
      onSwiper(swiper) {
        this.swiper = swiper;
      },
      onSlideChange(swiper) {
        this.currentTierTab = swiper.activeIndex;
      },
      refreshSwiper() {
        this.swiper.updateAutoHeight(300);
      },
      getChoicesAvailable(tier, index, upgrade) {
        // NOTE: multiclass/subclass is only available in tier 2 and 3
        //       so that's all we need to check
        const tierLevels = tier === 2 ? [5, 6, 7] : [8, 9, 10];

        // disable multiclass if multiclass has been picked before,
        // or if subclass has been picked before in the same tier
        if (upgrade.increase.multiclass) {
          // previous multiclass selections
          const multiclassSelection = this.character.levelSelections.find((selection) => {
            return selection.type === 'multiclass';
          });

          // short circuit here if multiclass has ever been selected
          if (multiclassSelection) return 0;

          // active subclass choice
          const subclassChosen = this.choicesMade.find((choice) => {
            return choice.type === 'subclass';
          });
          // previous same-tier subclass choice
          const sameTierSubclass = this.character.levelSelections.find((selection) => {
            return selection.type === 'subclass' && tierLevels.includes(selection.level);
          });

          // if subclass exists in this tier already, disable multiclass
          if (subclassChosen || sameTierSubclass) return 0;
        }

        // disable subclass if multiclass is chosen this tier
        if (upgrade.increase.subclass) {
          // NOTE: multiclass takes both level selections so we only need to
          //       check prior level selections for subclass in the same tier
          const sameTierMulticlass = this.character.levelSelections.find((selection) => {
            return selection.type === 'multiclass' && tierLevels.includes(selection.level);
          });

          if (sameTierMulticlass) return 0;
        }

        // for all other selections, we only need to check against number of leveling selections
        // NOTE: returning 0 here prevents this option from being selectable when leveling up
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
            const numExisting = this.character.levelSelections
              .filter((s) => s.id === upgrade.id).length;
            const options = getOptionsByUpgrade(upgrade, this.character);
            const [ firstOption ] = options;
            const optionSelections = Array.from(Array(upgrade.max)).map(() => {
              return upgrade.quantity && upgrade.quantity > 1 ? [] : firstOption.value;
            });

            // add the new experience to selection options, if applicable
            if (upgrade.increase.experience && this.addExperience) {
              options.push({
                label: this.addExperience.name,
                value: this.addExperience.id,
              });
            }

            tier1Choices.push(numExisting);
            tier1Options.push(options);
            tier1OptionSelections.push(optionSelections);
            existingTier1Choices.push(numExisting);
          });

        this.levelingData.tier2.upgrades
          .forEach((upgrade) => {
            const numExisting = upgrade.id === 'tier-2-multiclass' && this.character.levelSelections.find((s) => s.id === upgrade.id)
              ? 2
              : this.character.levelSelections.filter((s) => s.id === upgrade.id).length;
            const options = getOptionsByUpgrade(upgrade, this.character);
            const [ firstOption ] = options;
            const optionSelections = Array.from(Array(upgrade.max)).map(() => {
              return upgrade.quantity && upgrade.quantity > 1 ? [] : firstOption.value;
            });

            // add the new experience to selection options, if applicable
            if (upgrade.increase.experience && this.addExperience) {
              options.push({
                label: this.addExperience.name,
                value: this.addExperience.id,
              });
            }

            tier2Choices.push(numExisting);
            tier2Options.push(options);
            tier2OptionSelections.push(optionSelections);
            existingTier2Choices.push(numExisting);
          });

        this.levelingData.tier3.upgrades
          .forEach((upgrade) => {
            const numExisting = upgrade.id === 'tier-3-multiclass' && this.character.levelSelections.find((s) => s.id === upgrade.id)
              ? 2
              : this.character.levelSelections.filter((s) => s.id === upgrade.id).length;
            const options = getOptionsByUpgrade(upgrade, this.character);
            const [ firstOption ] = options;
            const optionSelections = Array.from(Array(upgrade.max)).map(() => {
              return upgrade.quantity && upgrade.quantity > 1 ? [] : firstOption.value;
            });

            // add the new experience to selection options, if applicable
            if (upgrade.increase.experience && this.addExperience) {
              options.push({
                label: this.addExperience.name,
                value: this.addExperience.id,
              });
            }

            tier3Choices.push(numExisting);
            tier3Options.push(options);
            tier3OptionSelections.push(optionSelections);
            existingTier3Choices.push(numExisting);
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
      getChoiceLabel(choice) {
        switch (choice.type) {
          // trait
          case 'trait':
            return `Your ${choice.options.join(' and ')} increase by +${choice.value}`;

          // health
          case 'healthSlot':
            return `Your Hit Points increase by +${choice.value}`;

          // stress
          case 'stressSlot':
            return `Your Stress increases by +${choice.value}`;

          // experience
          case 'experience':
            let expArr = [];

            choice.options.forEach((expId) => {
              if (this.addExperience && expId === this.addExperience.id) {
                expArr.push(this.addExperience.name);
              } else {
                let existingExp = this.character.experience.find((xp) => xp.id === expId);
                expArr.push(existingExp.name);
              }
            });

            return `Your ${expArr.join(' and ')} experiences increase by +1`;

          // armor
          case 'armorSlot':
            return `Your Armor Slots increase by +${choice.value}`;

          // evasion
          case 'evasion':
            return `Your Evasion increases by +${choice.value}`;

          // proficiency
          case 'proficiency':
            return `Your Proficiency increases by +${choice.value}`;

          // major threshold
          case 'majorDamageThreshold':
            return `Your Major Damage Threshold increases by +${choice.value}`;

          // severe threshold
          case 'severeDamageThreshold':
            return `Your Severe Damage Threshold increases by +${choice.value}`;

          // subclass
          case 'subclass':
            const subclassUpgrades = this.character.levelSelections.filter((s) => s.value === choice.value);
            const rank = subclassUpgrades.length > 1 ? 'Mastery' : 'Specialization';

            return `Your ${titleCase(choice.value)} Subclass rank becomes ${rank}`;

          // multiclass
          case 'multiclass':
            return `Multiclass into ${choice.options.subclass} ${choice.options.class}, gaining access to the ${choice.options.domain} domain`;

          default:
            return choice;
        }
      },
      saveNewTierOptions() {
        this.addExperience = { id: uuidv4(), score: 1, name: this.newExperience };
        this.$nextTick(() => this.generateChoicesData());
      },
      saveTierOptions() {
        this.acceptTierChoices = true;
      },
      saveLevelUp() {
        // if new tier reached, clear previous trait selections
        if (this.reachedNewTier) {
          this.character.agility.upgraded = false;
          this.character.strength.upgraded = false;
          this.character.finesse.upgraded = false;
          this.character.instinct.upgraded = false;
          this.character.presence.upgraded = false;
          this.character.knowledge.upgraded = false;
        }

        // new tier experience
        if (this.addExperience) {
          this.character.experience.push({ ...this.addExperience });
        }

        // tier choices
        this.choicesMade.forEach((choice) => {
          this.character.levelSelections.push({ ...choice });

          // disable trait selections until next tier
          if (choice.type === 'trait') {
            for (let i = 0, j = choice.options.length; i < j; i++) {
              this.character[choice.options[i]].upgraded = true;
            }
          }

          // add new subclass when taking multiclass
          if (choice.type === 'multiclass') {
            this.character.subclass.push(choice.options.subclass);
          }
        });

        // set new level
        this.character.level = this.newLevel;

        // save character
        this.charactersStore.saveCharacter(this.character);
        this.$emit('level-saved');
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
