<template lang="pug">
  .hero.mx-auto.relative.w-full
    .hero__image.w-full.h-screen.overflow-hidden(class="md:h-min")
      img.object-cover.w-full.h-full(
        :src="smallImage"
        class="md:hidden"
        height="1280"
        width="720"
      )
      img.object-cover.w-full.h-full(
        :src="largeImage"
        class="hidden md:block"
        height="1200"
        width="675"
      )
    slot
</template>

<script>
  export default {
    name: 'LandingHero',
    inject: ['mq'],
    props: {
      largeImage: {
        type: String,
        required: true,
      },
      smallImage: {
        type: String,
        required: true
      },
      imageAlt: {
        type: String,
        required: true,
      },
    },
    computed: {
      currentImage() {
        return this.mq.smMinus ? this.smallImage : this.largeImage;
      },
    },
    mounted() {
      console.log(this.largeImage);
    },
  };
</script>

<style lang="scss" scoped>
  @use '~/styles/media.scss';

  .hero__image {
    @include media.desktop-up {
      height: 60vh;
    }
  }
</style>
