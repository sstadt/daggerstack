<template lang="pug">
  .app
    Head
      Meta(
        name="viewport"
        content="height=device-height,width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"
      )
    NuxtPage
    BasicToast
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        storageLoaded: false,
      };
    },
    setup() {
      const builderStore = useBuilderStore();
      const charactersStore = useCharactersStore();

      return {
        builderStore,
        charactersStore,
      };
    },
    mounted() {
      this.builderStore.loadSavedCharacter();
      this.charactersStore.loadSavedCharacters();
      this.storageLoaded = true;
    },
  };
</script>

<style lang="scss">
  @import '~/styles/utility';
  @import '~/styles/transitions/fade';
  @import '~/styles/transitions/off-canvas';
  @import '~/styles/transitions/paginate';
  @import '~/styles/transitions/slide-fade';

  .nuxt-icon {
    display: inline-block;

    h1, h2, h3, h4, h5, h6, p & {
      vertical-align: middle;
    }
  }

  select {
    appearance: none;
    background-repeat: no-repeat;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAABGdBTUEAALGPC/xhBQAAAQtJREFUOBG1lEEOgjAQRalbGj2OG9caOACn4ALGtfEuHACiazceR1PWOH/CNA3aMiTaBDpt/7zPdBKy7M/DCL9pGkvxxVp7KsvyJftL5rZt1865M+Ucq6pyyF3hNcI7Cuu+728QYn/JQA5yKaempxuZmQngOwEaYx55nu+1lQh8GIatMGi+01NwBcEmhxBqK4nAPZJ78K0KKFAJmR3oPp8+Iwgob0Oa6+TLoeCvRx+mTUYf/FVBGTPRwDkfLxnaSrRwcH0FWhNOmrkWYbE2XEicqgSa1J0LQ+aPCuQgZiLnwewbGuz5MGoAhcIkCQcjaTBjMgtXGURMVHC1wcQEy0J+Zlj8bKAnY1/UzDe2dbAVqfXn6wAAAABJRU5ErkJggg==');
    background-size: 0.7rem;
    background-position: right 0.7rem center;
  }
</style>
