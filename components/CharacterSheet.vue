<template lang="pug">
  .character-sheet
    SheetHeader
      .flex.bg-black
        NavButton(
          v-for="(button, index) in navButtons"
          :icon="button.icon"
          class="w-1/4"
          @click="slideTo(index)"
        )
    Swiper(
      :slides-per-view="1"
      :autoheight="true"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    )
      SwiperSlide
        .container.space-y-4
          SheetStatistics
          SheetExperience
          SheetClassFeature
      SwiperSlide
        .container.space-y-4
          SheetWeapons
          SheetArmor
      SwiperSlide
        .container.space-y-4
          SheetGold
          SheetInventory
      SwiperSlide
        .container.space-y-4
          SheetHealth
          SheetBackground
          SheetConnections
</template>

<script>
  // NOTE: cannot make this reactive without memory leak
  let slider = null;

  export default {
    name: 'CharacterSheet',
    data() {
      return {
        navButtons: [
          { icon: 'attributes' },
          { icon: 'equipment' },
          { icon: 'inventory' },
          { icon: 'background' },
        ],
      };
    },
    setup() {
      const onSwiper = (swiper) => {
        slider = swiper;
      };
      const onSlideChange = () => {
        console.log('slide change');
      };

      return {
        onSwiper,
        onSlideChange,
      };
    },
    methods: {
      slideTo(slideIndex) {
        slider.slideTo(slideIndex);
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
