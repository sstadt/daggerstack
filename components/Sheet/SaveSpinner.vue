<template lang="pug">
  .fixed.bottom-4.right-4.pointer-none.z-20
    .flex.flex-row.gap-1.py-3(v-if="pushQueued || pendingSave.length > 0")
      .ball.w-2.h-2.rounded-full.bg-violet-500
      .ball.w-2.h-2.rounded-full.bg-violet-500(class="[animation-delay:-.3s]")
      .ball.w-2.h-2.rounded-full.bg-violet-500(class="[animation-delay:-.5s]")
    .loader(v-else-if="savingCharacter")
</template>

<script>
  import { mapState } from 'pinia';

  export default {
    name: 'SheetSaveSpinner',
    computed: {
      ...mapState(useCharactersStore, ['pushQueued', 'savingCharacter']),
      ...mapState(useUserStore, ['pendingSave']),
    },
  };
</script>

<style lang="scss" scoped>
  .ball {
    animation: bounce 1s infinite;

    &:nth-child(2) {
      animation-delay: .15s;
    }

    &:nth-child(3) {
      animation-delay: .3s;
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(-75%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }

  .loader {
    width: 40px;
    height: 40px;
    display: inline-block;
    border: 5px solid rgb(91, 33, 182);
    border-radius: 50%;
    border-top-color: transparent;
    border-bottom-color: transparent;
    animation: rot5 1s infinite;
  }

  @keyframes rot5 {
    0% {
      transform: rotate(0);
    }

    50% {
      transform: rotate(180deg);
      border-top-color: rgb(91, 33, 182);
      border-bottom-color: rgb(167, 139, 250);
      border-right-color: transparent;
      border-left-color: transparent;
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>
