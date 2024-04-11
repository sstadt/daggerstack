<template lang="pug">
  .container.p-8.space-y-8
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
          :initial-slide="customDescription === '' ? 0 : 1"
          @swiper="onSwiper"
          @slide-change="onSlideChange"
        )
          SwiperSlide
            .space-y-4
              InputPicker(label="clothes" :options="descriptions.clothes" v-model="selectedClothes")
              InputPicker(label="eyes" :options="descriptions.eyes" v-model="selectedEyes")
              InputPicker(label="body" :options="descriptions.body" v-model="selectedBody")
              InputPicker(label="skin" :options="descriptions.skin" v-model="selectedSkin")
              InputPicker(label="attitude" :options="descriptions.attitude" v-model="selectedAttitude")
          SwiperSlide
            InputTextarea(v-model="customDescription")
    .space-y-4
      h2.text-center.text-2xl.font-black.uppercase Domain Cards
      p.text-center.mb-2.text-sm.text-slate-500 Choose two cards from the level one -domain1- and -domain2- domain decks.
    .flex.justify-between.items-center
      NuxtLink(to="/") Finish Later
      BasicButton.block(type="submit") Next
</template>

<script>
  import generalData from '~/data/general.json';
  import { joinWithAnd } from '~/helpers/array';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep5',
    data() {
      const isNewCharacter = !this.builderStore.character.id;

      return {
        descriptions: generalData.description,
        selectedClothes: [],
        selectedEyes: [],
        selectedBody: [],
        selectedSkin: [],
        selectedAttitude: [],
        currentIndex: 0,
        customDescription: isNewCharacter ? '' : this.builderStore.character.description,
      };
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
      setTab(tab) {
        this.swiper.slideTo(tab);
      },
      buildDescription() {
        const clothes = `Clothes that are ${joinWithAnd(this.selectedClothes)}.`;
        const eyes = `Eyes like ${joinWithAnd(this.selectedEyes)}.`;
        const body = `A ${joinWithAnd(this.selectedBody)} body,`;
        const skin = `with skin the color of ${joinWithAnd(this.selectedSkin)}.`;
        const attitude = `Standing with the bearing of ${joinWithAnd(this.selectedAttitude)}.`;

        return `${clothes} ${eyes} ${body} ${skin} ${attitude}`;
      },
      next() {
        const description = this.currentIndex === 0
          ? this.buildDescription()
          : this.customDescription;

        this.builderStore.updateCharacter({ description });

        this.$emit('next');
      },
    },
  };
</script>
