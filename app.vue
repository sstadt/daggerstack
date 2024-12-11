<template lang="pug">
  .app.min-h-screen.flex.flex-col
    Head
      Meta(
        name="viewport"
        content="height=device-height,width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"
      )
    Transition(name="slide-fade-top")
      NavTopbar(v-if="$route.name !== 'index'")
    NuxtPage
    NavFooter.mt-auto
    BasicToast
</template>

<script>
  export default {
    name: 'App',
  };
</script>

<script setup>
  import { waitUntil } from './helpers/utility';

  const userStore = useUserStore();
  const builderStore = useBuilderStore();
  const charactersStore = useCharactersStore();
  const itemsStore = useItemsStore();
  const weaponsStore = useWeaponsStore();
  const armorStore = useArmorStore();
  const communityStore = useCommunityStore();

  onMounted(() => {
    userStore.init();
    builderStore.loadSavedCharacter();

    // hydrate homebrew items globally
    waitUntil(() => userStore.loaded).then(() => {
      itemsStore.hydrate();
      weaponsStore.hydrate();
      armorStore.hydrate();
      communityStore.hydrate();
    });
  });
</script>

<style lang="scss">
  @import '~/styles/utility';
  @import '~/styles/transitions/fade';
  @import '~/styles/transitions/off-canvas';
  @import '~/styles/transitions/paginate';
  @import '~/styles/transitions/slide-fade';

  .nuxt-icon {
    display: inline-block;

    h1 &,
    h2 &,
    h3 &,
    h4 &,
    h5 &,
    h6 &,
    p &,
    a &,
    button &,
    li & {
      vertical-align: middle;
    }
  }

  .title {
    font-family: "Cinzel Decorative", serif;
  }

  .h-full-minus-nav {
    // account for the topbar and footer
    min-height: calc(100vh - (38px + 56px));
  }

  .link {
    text-decoration: underline;
  }

  select {
    appearance: none;
    background-repeat: no-repeat;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAABGdBTUEAALGPC/xhBQAAAQtJREFUOBG1lEEOgjAQRalbGj2OG9caOACn4ALGtfEuHACiazceR1PWOH/CNA3aMiTaBDpt/7zPdBKy7M/DCL9pGkvxxVp7KsvyJftL5rZt1865M+Ucq6pyyF3hNcI7Cuu+728QYn/JQA5yKaempxuZmQngOwEaYx55nu+1lQh8GIatMGi+01NwBcEmhxBqK4nAPZJ78K0KKFAJmR3oPp8+Iwgob0Oa6+TLoeCvRx+mTUYf/FVBGTPRwDkfLxnaSrRwcH0FWhNOmrkWYbE2XEicqgSa1J0LQ+aPCuQgZiLnwewbGuz5MGoAhcIkCQcjaTBjMgtXGURMVHC1wcQEy0J+Zlj8bKAnY1/UzDe2dbAVqfXn6wAAAABJRU5ErkJggg==');
    background-size: 0.7rem;
    background-position: right 0.7rem center;
  }
</style>
