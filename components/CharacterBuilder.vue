<template lang="pug">
  transition(name="fade")
    .character-builder(v-if="saveLoaded")
      h2.text-center.text-2xl.font-black.uppercase.p-4 Create Character
      .flex.flex-col.flex-grow
        BuilderProgress(:page="currentPage" :steps="8" @set="setStep")
        .flex.flex-grow
          Swiper.builder__slider(
            :slides-per-view="1"
            :initial-slide="currentPage"
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
        saveLoaded: false,
      };
    },
    computed: {
      ...mapState(useBuilderStore, ['currentPage', 'character']),
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    mounted() {
      if (!this.$route.query.new) {
        this.builderStore.loadSavedCharacter();
      }

      this.saveLoaded = true;
    },
    methods: {
      slideTo(slideIndex) {
        this.swiper.slideTo(slideIndex);
      },
      onSwiper(swiper) {
        this.swiper = swiper;
      },
      onSlideChange(swiper) {
        this.builderStore.currentPage = swiper.activeIndex;
        this.builderStore.savePage();
      },
      setStep(step) {
        this.swiper.slideTo(step);
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
