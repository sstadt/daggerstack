<template lang="pug">
  .app
    NuxtPage
    CharacterBuilder(v-if="storageLoaded")
</template>

<script>
  import { useBuilderStore } from '~/stores/builder';
  import { useCharactersStore } from '~/stores/characters';

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
  .app {
    &, & > * {
      min-height: 100vh;
    }
  }

  .nuxt-icon {
    display: inline-block;
  }

  select {
    appearance: none;
    background-repeat: no-repeat;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAABGdBTUEAALGPC/xhBQAAAQtJREFUOBG1lEEOgjAQRalbGj2OG9caOACn4ALGtfEuHACiazceR1PWOH/CNA3aMiTaBDpt/7zPdBKy7M/DCL9pGkvxxVp7KsvyJftL5rZt1865M+Ucq6pyyF3hNcI7Cuu+728QYn/JQA5yKaempxuZmQngOwEaYx55nu+1lQh8GIatMGi+01NwBcEmhxBqK4nAPZJ78K0KKFAJmR3oPp8+Iwgob0Oa6+TLoeCvRx+mTUYf/FVBGTPRwDkfLxnaSrRwcH0FWhNOmrkWYbE2XEicqgSa1J0LQ+aPCuQgZiLnwewbGuz5MGoAhcIkCQcjaTBjMgtXGURMVHC1wcQEy0J+Zlj8bKAnY1/UzDe2dbAVqfXn6wAAAABJRU5ErkJggg==');
    background-size: 0.7rem;
    background-position: right 0.7rem center;
  }

  // utilities

  .u-sr-only {
    border: 0 !important;
    clip: rect(1px, 1px, 1px, 1px) !important; /* 1 */
    clip-path: inset(50%) !important; /* 2 */
    height: 1px !important;
    margin: -1px !important;
    overflow: hidden !important;
    padding: 0 !important;
    position: absolute !important;
    width: 1px !important;
    white-space: nowrap !important; /* 3 */
  }

  .u-radius-50 {
    border-radius: 50%;
  }

  .u-inline-button {
    height: 44px;
    margin-top: 24px;
  }

  // transitions

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-active {
    opacity: 0;
  }

  .off-canvas-right-enter-active,
  .off-canvas-right-leave-active {
    transition: all 0.3s ease;
  }

  .off-canvas-right-enter-from,
  .off-canvas-right-leave-active {
    opacity: 0;
    transform: translateX(50%);
  }

  .off-canvas-top-enter-active,
  .off-canvas-top-leave-active {
    transition: all 0.3s ease;
  }

  .off-canvas-top-enter-from,
  .off-canvas-top-leave-active {
    opacity: 0;
    transform: translateY(-50%);
  }

  .slide-fade-left-enter-active,
  .slide-fade-left-leave-active {
    transition: all 0.3s ease;
  }

  .slide-fade-left-enter-from,
  .slide-fade-left-leave-active {
    transform: translateX(30px);
    opacity: 0;
  }

  .slide-fade-top-enter-active,
  .slide-fade-top-leave-active {
    transition: all 0.3s ease;
  }

  .slide-fade-top-enter-from,
  .slide-fade-top-leave-active {
    transform: translateY(-30px);
    opacity: 0;
  }
</style>
