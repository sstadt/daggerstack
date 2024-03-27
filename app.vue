<template lang="pug">
  .app.pb-10
    NuxtPage
    CharacterBuilder
</template>

<style lang="scss">
  .app {
    &, & > * {
      min-height: 100vh;
    }
  }

  .nuxt-icon {
    display: inline-block;
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
</style>
