<template lang="pug">
  .character-builder
    BasicModal(title="New Character" :is-open="isOpen" :close="close")
      BasicButton(@click="prev")
        | Previous
      BasicButton(@click="next")
        | Next
      Swiper(
        :slides-per-view="1"
        :autoheight="true"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      )
        SwiperSlide
          | 1
        SwiperSlide
          | 2
        SwiperSlide
          | 3
        SwiperSlide
          | 4
        SwiperSlide
          | 5
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
      next() {
        this.swiper.slideNext();
      },
      prev() {
        this.swiper.slidePrev();
      },
      close() {
        this.builderStore.close();
      },
    },
  };
</script>
