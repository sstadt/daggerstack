<template lang="pug">
  div
    Head
      Title Daggerstack.com
    LandingHero.hero(
      :large-image="desktopImage"
      :small-image="mobileImage"
      image-alt="Adventuring party walking down the path with the sun setting over mountains in the background"
    )
      .bg-white.w-full.p-8.text-center.absolute(
        class="top-12 left-1/2 -translate-x-1/2 md:top-auto md:left-auto md:translate-x-0"
      )
        .space-y-4
          .space-y-2
            h1.title.text-4xl(class="md:text-6xl") Daggerstack
            p An <strong>unofficial</strong> digital character sheet for <a href="https://daggerheart.com" target="_blank" class="link">Daggerheart</a> characters
          .space-x-4
            NuxtLink.inline-block(to="/signup")
              BasicButton(size="lg" priority="secondary") Sign Up
            NuxtLink.inline-block(to="/login")
              BasicButton(size="lg") Log In
        a.mt-6.inline-block.text-lg.uppercase.font-bold(href="https://discord.gg/qPDntvtaNx" target="_blank")
          span Join the discussion
          NuxtIcon.ml-2.text-3xl(name="discord")
</template>

<script>
  import desktopImage from '~/assets/images/party-desktop.jpeg';
  import mobileImage from '~/assets/images/party-mobile.jpeg';

  export default {
    name: 'IndexPage',
    data() {
      return {
        desktopImage,
        mobileImage,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .title {
    font-family: "Cinzel Decorative", serif;
  }
</style>
