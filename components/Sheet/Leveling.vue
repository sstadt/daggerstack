<template lang="pug">
  .flex.flex-col.flex-grow
    transition(name="fade" mode="out-in")
      div(v-if="loaded") leveling tables
      .absolute(
        v-else
        class="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      )
        h2.text-6xl.text-center.uppercase.whitespace-nowrap.leveling__title
          | Level <strong>{{ character.level + 1 }}</strong>
    transition(name="fade")
      .p-6.mt-auto.shadow(v-if="loaded")
        BasicButton.w-full(@click="saveLevelUp") Save
</template>

<script>
  import confetti from 'canvas-confetti';

  export default {
    name: 'SheetLeveling',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        loaded: false,
        introDuration: 5200,
      };
    },
    mounted() {
      confetti({
        particleCount: 200,
        angle: 90,
        spread: 90,
      });

      setTimeout(() => {
        this.loaded = true;
      }, this.introDuration);
    },
    methods: {
      saveLevelUp() {
        console.log('>>> save selections');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .leveling__title {
    transform-style: preserve-3d;
    transform: translate3d(0,0,0);
    animation: OpeningSequence 5.2s linear forwards
  }

  @keyframes OpeningSequence {
    0% {
      text-shadow: 0 0 50px #fff;
      letter-spacing: 80px;
      opacity: 0.2;
      transform: rotateY(-90deg);
    }
    50% {
      text-shadow: 0 0 1px #fff;
      letter-spacing: 14px;
      opacity: 0.8;
      transform: rotateY(0deg);
    }
    85% {
      text-shadow: 0 0 1px #fff;
      opacity: 0.8;
      transform: rotateY(0deg) translateZ(100px);
    }
    100% {
      text-shadow: 0 0 10px #fff;
      opacity: 0;
      transform: translateZ(130px);
      pointer-events: none;
    }
  }
</style>
