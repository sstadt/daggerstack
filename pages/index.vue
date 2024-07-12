<template lang="pug">
  div
    Head
      Title Daggerstack.com
    LandingHero.hero(
      :large-image="desktopImage"
      :small-image="mobileImage"
      image-alt="Adventuring party walking down the path with the sun setting over mountains in the background"
    )
      .bg-white.w-full.px-8.pt-8.pb-6.text-center.absolute(
        class="top-12 left-1/2 -translate-x-1/2 md:top-auto md:left-auto md:translate-x-0"
      )
        .space-y-4
          .space-y-2
            h1.title.text-4xl(class="md:text-6xl") Daggerstack
            p.max-w-72.mx-auto(class="md:max-w-md") An <strong>unofficial</strong> digital character sheet for <a href="https://daggerheart.com" target="_blank" class="link">Daggerheart</a> characters. Currently supports version {{ characterVersion }}.
          Transition(name="fade" mode="out-in")
            BasicLoader.mx-auto.my-8(v-if="!userStore.loaded")
            .space-x-4(v-else-if="!userStore.user")
              NuxtLink.inline-block(to="/auth/signup")
                BasicButton(size="lg" priority="secondary") Sign Up
              NuxtLink.inline-block(to="/auth/login")
                BasicButton(size="lg") Log In
            NuxtLink.inline-block(v-else to="/character")
              BasicButton(size="lg") Character List
        a.mt-6.inline-block.text-lg.uppercase.font-bold(href="https://discord.gg/qPDntvtaNx" target="_blank")
          span Join the discussion
          NuxtIcon.ml-2.text-3xl(name="discord")
</template>

<script>
  import desktopImage from '~/assets/images/party-desktop.jpeg';
  import mobileImage from '~/assets/images/party-mobile.jpeg';

  import GENERAL from '~/data/general';

  export default {
    name: 'IndexPage',
    data() {
      return {
        desktopImage,
        mobileImage,
        characterVersion: GENERAL.currentCharacterVersion,
      };
    },
    setup() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      return { userStore, toastStore };
    },
    mounted() {
      // show errors when clicking through verification emails
      if (this.$route.query.error_description) {
        this.toastStore.postMessage({ body: this.$route.query.error_description });
      }
    },
  };
</script>
