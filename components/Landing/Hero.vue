<template lang="pug">
  .hero.mx-auto.h-screen.relative(class="md:h-min")
    img.object-cover.w-full.h-full(:src="smallImage" class="md:hidden")
    img.object-cover.w-full.h-full(:src="largeImage" class="hidden md:block")
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
  };
</script>

<style lang="scss" scoped>
  .hero {
    max-width: 1200px;
  }
</style>
