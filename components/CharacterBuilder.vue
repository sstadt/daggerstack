<template lang="pug">
  .character-builder
    BasicModal(title="New Character" :is-open="isOpen" :close="close")
      BuilderProgress.mb-8(:page="currentIndex", @set="setStep")
      Swiper(
        :slides-per-view="1"
        :autoheight="true"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      )
        SwiperSlide
          BuilderStep1(@next="swiper.slideNext()")
        SwiperSlide
          BuilderStep2(@next="swiper.slideNext()")
        SwiperSlide
          BuilderStep3(@next="swiper.slideNext()")
        SwiperSlide
          BuilderStep4(@next="swiper.slideNext()")
        SwiperSlide
          BuilderStep5
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
      ...mapState(useBuilderStore, ['isOpen']),
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
    },
  };
</script>
