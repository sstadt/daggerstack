<template lang="pug">
  .flex.flex-col.flex-grow
    transition(name="fade" mode="out-in")
      //- new tier selection
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
      .flex.flex-col.p-6.overflow-hidden.flex-grow(v-else-if="showTierOptions" @submit="saveTierOptions")
        .flex.justify-center.items-center.space-x-4.shrink-0
          button.flex.text-xl(
            :disabled="currentIndex === 0"
            :class="{ 'opacity-30': currentIndex === 0 }"
            @click="prev"
          )
            span.sr-only Tier {{ Math.max(currentIndex, 1) }}
            NuxtIcon(name="chevron-left")
          h3.text-xl.font-bold.uppercase Tier {{ currentIndex + 1 }}
          button.flex.text-xl(
            :disabled="currentIndex >= 2"
            :class="{ 'opacity-30': currentIndex >= 2 }"
            @click="next"
          )
            span.sr-only Tier {{ Math.min(currentIndex + 2, 3) }}
            NuxtIcon(name="chevron-right")
        .shrink-0
          Swiper.tier-carousel(
            :items-to-show="1"
            :centered-slides="true"
            :auto-height="true"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
          )
            SwiperSlide
              .m-2
                .flex.space-x-2.py-2(v-for="upgrade in levelingData.tier1.upgrades")
                  .option-checkboxes.pt-1.flex.justify-end.items-start.flex-shrink-0
                    InputCheckboxCounter(:max="upgrade.max")
                  .flex-grow
                    p {{ upgrade.description }}
            SwiperSlide
              .m-2
                .flex.space-x-2.py-2(v-for="upgrade in levelingData.tier2.upgrades")
                  .option-checkboxes.pt-1.flex.justify-end.items-start.flex-shrink-0
                    InputCheckboxCounter(:max="upgrade.max")
                  .flex-grow
                    p {{ upgrade.description }}
            SwiperSlide
              .m-2
                .flex.space-x-2.py-2(v-for="upgrade in levelingData.tier3.upgrades")
                  .option-checkboxes.pt-1.flex.justify-end.items-start.flex-shrink-0
                    InputCheckboxCounter(:max="upgrade.max")
                  .flex-grow
                    p {{ upgrade.description }}
        .pt-6.mt-auto.shrink-0
          BasicButton.w-full(@click="saveTierOptions") Save
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
      let currentIndex = 0;

      if (newLevel > 4) {
        currentIndex = newLevel > 7 ? 2 : 1;
      }

      return {
        currentIndex,
        newLevel,
        reachedNewTier,
        levelingData: { tier1, tier2, tier3 },
        loaded: false,
        introDuration: 5200,
        swiper: null,
        newExperience: '',
        addExperience: null,
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
    },
    methods: {
      next() {
        this.swiper.slideTo(Math.min(this.currentIndex + 1, 2));
      },
      prev() {
        this.swiper.slideTo(Math.max(this.currentIndex - 1, 0));
      },
      onSwiper(swiper) {
        this.swiper = swiper;
      },
      onSlideChange(swiper) {
        this.currentIndex = swiper.activeIndex;
      },
      saveNewTierOptions() {
        console.log('>>> saveNewTierOptions');
        this.addExperience = { score: 1, name: this.newExperience };
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
