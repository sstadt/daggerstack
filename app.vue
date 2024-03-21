<template lang="pug">
  div
    NuxtPage
</template>

<style lang="scss">
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

  // transitions

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  .off-canvas-right-enter-active,
  .off-canvas-right-leave-active {
    transition: all 0.3s ease;
  }

  .off-canvas-right-enter,
  .off-canvas-right-leave-active {
    opacity: 0;
    transform: translateX(100%);
  }
</style>
