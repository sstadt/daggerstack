<template lang="pug">
  .character-sheet
    SheetHeader(:character="character")
      .flex.bg-black.relative
        NavButton(
          v-for="(button, index) in navButtons"
          :icon="button.icon"
          class="w-1/4"
          @click="slideTo(index)"
        )
        .absolute.bottom-0.h-2.bg-white.pointer-events-none.transition-all(
          class="w-1/4"
          :style="indicatorStyle"
        )
    Swiper(
      :slides-per-view="1"
      :autoheight="true"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    )
      SwiperSlide
        .container.space-y-4.pb-4
          SheetStatistics(:character="character")
          SheetExperience(:character="character")
          SheetClassFeature(:character="character")
      SwiperSlide
        .container.space-y-4.pb-4
          SheetWeapons(:character="character")
          SheetArmor(:character="character")
      SwiperSlide
        .container.space-y-4.pb-4
          SheetGold(:character="character")
          SheetInventory(:character="character")
      SwiperSlide
        .container.space-y-4.pb-4
          SheetBackground(:character="character")
          SheetConnections(:character="character")
</template>

<script>
  export default {
    name: 'CharacterSheet',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        swiper: null,
        currentIndex: 0,
        navButtons: [
          { icon: 'attributes' },
          { icon: 'equipment' },
          { icon: 'inventory' },
          { icon: 'background' },
        ],
      };
    },
    computed: {
      indicatorStyle() {
        const left = this.currentIndex * 25;

        return {
          left: `${left}%`,
        };
      },
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
    },
  };
</script>

<style lang="scss">
  .character-sheet {
    & > *:not(:last-child) {
      margin-bottom: 20px;
    }
  }
</style>
