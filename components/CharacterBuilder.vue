<template lang="pug">
  .foo
    BasicModal(title="New Character" :is-open="isOpen" :close="close")
      .flex.flex-col.flex-grow
        BuilderProgress(:page="currentIndex" :steps="8" @set="setStep")
        .flex.flex-grow
          Swiper.builder__slider(
            :slides-per-view="1"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
          )
            SwiperSlide.min-h-full
              BuilderStep1(@next="swiper.slideNext()")
            SwiperSlide.min-h-full
              BuilderStep2(@next="swiper.slideNext()")
            SwiperSlide.min-h-full
              BuilderStep3(@next="swiper.slideNext()")
            SwiperSlide.min-h-full
              BuilderStep4(@next="swiper.slideNext()")
            SwiperSlide.min-h-full
              BuilderStep5(@next="swiper.slideNext()")
            SwiperSlide.min-h-full
              BuilderStep6(@next="swiper.slideNext()")
            SwiperSlide.min-h-full
              BuilderStep7(@next="swiper.slideNext()")
            SwiperSlide.min-h-full.flex-grow-1
              BuilderStep8(@next="createCharacter")
</template>

<script>
  import { mapState } from 'pinia';
  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'CharacterBuilder',
    data() {
      return {
        swiper: null,
        currentIndex: 0,
      };
    },
    computed: {
      ...mapState(useBuilderStore, ['isOpen', 'character']),
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    methods: {
      slideTo(slideIndex) {
        this.swiper.slideTo(slideIndex);
      },
      onSwiper(swiper) {
        this.swiper = swiper;
      },
      onSlideChange(swiper) {
        this.currentIndex = swiper.activeIndex;
      },
      setStep(step) {
        this.swiper.slideTo(step);
      },
      close() {
        this.builderStore.close();
      },
      createCharacter() {
        this.builderStore.createCharacter();
      },
    },
  };
</script>

<style lang="scss">
  .builder__slider {
    display: flex;
  }
</style>
