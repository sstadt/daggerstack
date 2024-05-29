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
                .py-2(v-for="(upgrade, index) in levelingData[`tier${tier}`].upgrades")
                  .flex.space-x-2
                    .option-checkboxes.pt-1.flex.justify-end.items-start.flex-shrink-0
                      InputCheckboxCounter(
                        v-model="tierChoices[tier - 1][index]"
                        :max="upgrade.max"
                        :enabled="choicesAvailable(tier, index, upgrade)"
                        :increment="upgrade.increase.multiclass ? 2 : 1"
                      )
                    .flex-grow
                      p {{ upgrade.description }}
                  .space-y-2
                    div(v-for="n in upgrade.max")
                      Transition(name="slide-fade-left")
                        InputSelect(
                          :key="n"
                          v-if="Array.isArray(tierOptions[tier - 1][index]) && tierChoices[tier - 1][index] >= n"
                          v-model="tierOptionSelections[tier - 1][index][n - 1]"
                          :options="tierOptions[tier - 1][index]"
                        )
        .pt-6.mt-auto.shrink-0
          BasicButton.w-full(@click="saveTierOptions") Next
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

  import { getOptionsByUpgrade } from '~/helpers/character';
  import { useCharactersStore } from '~/stores/characters';

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
        loaded: true, // TODO: set to false initially
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

      this.generateChoicesData();
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
      saveNewTierOptions() {
        this.addExperience = { score: 1, name: this.newExperience };
      },
      saveTierOptions() {
        console.log('>>> saveTierOptions');
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
            const options = getOptionsByUpgrade(upgrade);
            const [ firstOption ] = options;

            tier1Choices.push(0); // TODO: reconcile with existing choices
            tier1Options.push(options);
            tier1OptionSelections.push(Array.from(Array(upgrade.max)).map(() => firstOption.value)); // TODO: reconcole with existing choices
            existingTier1Choices.push(0); // TODO: reconcile with existing choices
          });

        this.levelingData.tier2.upgrades
          .forEach((upgrade) => {
            const options = getOptionsByUpgrade(upgrade);
            const [ firstOption ] = options;

            tier2Choices.push(0); // TODO: reconcile with existing choices
            tier2Options.push(options);
            tier2OptionSelections.push(Array.from(Array(upgrade.max)).map(() => firstOption.value)); // TODO: reconcole with existing choices
            existingTier2Choices.push(0); // TODO: reconcile with existing choices
          });

        this.levelingData.tier3.upgrades
          .forEach((upgrade) => {
            const options = getOptionsByUpgrade(upgrade);
            const [ firstOption ] = options;

            tier3Choices.push(0); // TODO: reconcile with existing choices
            tier3Options.push(options);
            tier3OptionSelections.push(Array.from(Array(upgrade.max)).map(() => firstOption.value)); // TODO: reconcole with existing choices
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
