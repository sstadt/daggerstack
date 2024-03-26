<template lang="pug">
  .container.px-8.pb-4.space-y-8
    .space-y-4
      h2.text-center.text-2xl.font-black.uppercase Description
      div
        .flex.justify-center.space-x-8.mb-4
          button.py-2.border-b.transition-colors(
            :class="{ 'border-b-black': currentIndex === 0 }"
            @click="setTab(0)"
          ) Generate
          button.py-2.border-b.transition-colors(
            :class="{ 'border-b-black': currentIndex === 1 }"
            @click="setTab(1)"
          ) Custom
        Swiper(
          :slides-per-view="1"
          :autoheight="true"
          @swiper="onSwiper"
          @slide-change="onSlideChange"
        )
          SwiperSlide
            .space-y-2
              InputPicker(label="clothes" :options="descriptions.clothes" v-model="selectedClothes")
              InputPicker(label="eyes" :options="descriptions.eyes" v-model="selectedEyes")
              InputPicker(label="body" :options="descriptions.body" v-model="selectedBody")
              InputPicker(label="skin" :options="descriptions.skin" v-model="selectedSkin")
              InputPicker(label="attitude" :options="descriptions.attitude" v-model="selectedAttitude")
          SwiperSlide
            InputTextarea
    .space-y-4
      h2.text-center.text-2xl.font-black.uppercase Domain Cards
      p.text-center.mb-2.text-sm.text-slate-500 Choose two cards from the level one -domain1- and -domain2- domain decks.
      BasicButton.block.ml-auto(@click="$emit('next')") Next
</template>

<script>
  import generalData from '~/data/general.json';

  export default {
    name: 'BuilderStep5',
    data() {
      return {
        descriptions: generalData.description,
        selectedClothes: [],
        selectedEyes: [],
        selectedBody: [],
        selectedSkin: [],
        selectedAttitude: [],
        currentIndex: 0,
      };
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
      setTab(tab) {
        this.swiper.slideTo(tab);
      },
    },
  };
</script>
