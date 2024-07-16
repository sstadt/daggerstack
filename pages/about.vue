<template lang="pug">
  div
    Head
      Title Daggerstack.com - About
    LandingHero.hero(
      :large-image="desktopImage"
      :small-image="mobileImage"
      image-alt="TTRPG miniatures in a dungeon combat"
    )
      .bg-white.w-full.px-8.pt-8.pb-6.text-center.absolute(
        class="top-12 left-1/2 -translate-x-1/2"
      )
        .space-y-4
          .space-y-2
            h1.title.text-4xl(class="md:text-6xl") About Daggerstack
            p.max-w-72.mx-auto(class="md:max-w-md") An <strong>unofficial</strong> digital character sheet for <a href="https://daggerheart.com" target="_blank" class="link">Daggerheart</a> characters. Currently supports version {{ characterVersion }}.
    LandingFlipFlop
      template(v-slot:visual)
        a.flex.flex-col.justify-center.items-center(:href="discordLink")
          NuxtIcon.discord.logo-icon(name="discord")
          p.uppercase.text-2xl.font-bold.text-center Join the <br/>Discussion
      template(v-slot:description)
        ul.text-2xl.space-y-4
          li
            NuxtIcon.text-green-600.mr-3(name="check-mark")
            | Community Feedback
          li
            NuxtIcon.text-green-600.mr-3(name="check-mark")
            | Bug Reports
          li
            NuxtIcon.text-green-600.mr-3(name="check-mark")
            | Feature Requests
          li
            NuxtIcon.text-green-600.mr-3(name="check-mark")
            | Patch Notes
          li
            NuxtIcon.text-green-600.mr-3(name="check-mark")
            | Community Resources
    LandingFlipFlop(flip dark)
      template(v-slot:visual)
        a.flex.flex-col.justify-center.items-center(:href="patreonLink")
          NuxtIcon.logo-icon(name="patreon")
          p.uppercase.text-2xl.font-bold.text-center Support <br/>Development
      template(v-slot:description)
        p.max-w-80.text-3xl.text-center.leading-10 Although this is a passion project, and <strong>100% FREE</strong> to use, your donations make it possible to continue development.
    LandingFlipFlop
      template(v-slot:visual)
        NuxtIcon.logo-icon(name="daggerheart")
      template(v-slot:description)
        p.max-w-80.font-bold.text-center This app is based on the following Public Game Content created and owned by Darrington Press: Daggerheart Open Beta v{{ characterVersion }}, Darrington Press, LLC, 2024, available at <a href="https://daggerheart.com" class="link">daggerheart.com</a>.
</template>

<script>
  import desktopImage from '~/assets/images/hero-about-desktop.jpg';
  import mobileImage from '~/assets/images/hero-about-mobile.jpg';

  import { DISCORD_INVITE_URL, PATREON_URL } from '~/config/app';

  import GENERAL from '~/data/general';

  export default {
    name: 'AboutPage',
    data() {
      return {
        desktopImage,
        mobileImage,
        characterVersion: GENERAL.currentCharacterVersion,
        discordLink: DISCORD_INVITE_URL,
        patreonLink: PATREON_URL,
      };
    },
  };
</script>

<style lang="scss" scoped>
  @use '~/styles/media.scss';

  .logo-icon {
    font-size: 6rem;

    @include media.tablet-up() {
      font-size: 10rem;
    }
  }

  .discord {
    color: #5E66E3;
  }
</style>
