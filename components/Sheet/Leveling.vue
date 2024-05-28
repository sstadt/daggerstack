<template lang="pug">
  .flex.flex-col.flex-grow
    transition(name="fade" mode="out-in")
      .p-3.overflow-hidden(v-if="loaded")
        .flex.justify-center.items-center.space-x-4.mb-6
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
        Swiper.tier-carousel(
          :items-to-show="1"
          :centered-slides="true"
          :auto-height="true"
          @swiper="onSwiper"
          @slide-change="onSlideChange"
        )
          SwiperSlide
            .m-1.bg-green-500 tier 1
          SwiperSlide
            .m-1.bg-blue-500 tier 2
          SwiperSlide
            .m-1.bg-red-500 tier 3
      .absolute(
        v-else
        class="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      )
        h2.text-6xl.text-center.uppercase.whitespace-nowrap.leveling__title
          | Level <strong>{{ character.level + 1 }}</strong>
    transition(name="fade")
      .p-6.mt-auto.shadow(v-if="loaded")
        BasicButton.w-full(@click="saveLevelUp") Save
</template>

<script>
  import confetti from 'canvas-confetti';

  export default {
    name: 'SheetLeveling',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        loaded: false,
        introDuration: 5200,
        swiper: null,
        currentIndex: 0, // TODO: this should default to the highest available tier
      };
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
      saveLevelUp() {
        console.log('>>> save selections');
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
</style>
