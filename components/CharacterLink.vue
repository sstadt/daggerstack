<template lang="pug">
  .w-full.flex.items-stretch(
    v-touch:swipe.left="() => showControls()"
    v-touch:swipe.right="() => hideControls()"
  )
    NuxtLink.block.text-3xl.p-6.w-full.text-left.transition-all(
      v-if="isValid"
      class="hover:bg-slate-200 focus:bg-slate-200 lg:px-0"
      :to="`/character/${character.id}`"
    ) {{ character.name }}
    .flex.flex-col.p-6.w-full.text-left.transition-all(v-else)
      .text-3xl {{ character.name }}
      p.text-red-600
        NuxtIcon.mr-1(name="warning")
        span This character is not compatible with the current ruleset and cannot be loaded
    transition(name="slide-fade-left")
      button.text-white.bg-red-600.flex.justify-center.items-center.p-4.h-auto(
        v-if="controlsVisible || mq.lgPlus"
        type="button"
        @click="deleteCharacter"
      )
        NuxtIcon.text-4xl(name="trash")
</template>

<script>
  import GENERAL from '~/data/general';

  export default {
    name: 'CharacterLink',
    inject: ['mq'],
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        controlsVisible: false,
      };
    },
    computed: {
      linkClass() {
        return {
          'shift-left': this.controlsVisible
        };
      },
      isValid() {
        return this.character.version === GENERAL.currentCharacterVersion;
      },
    },
    methods: {
      showControls() {
        this.controlsVisible = true;

        setTimeout(() => {
          this.hideControls();
        }, 10000);
      },
      hideControls() {
        this.controlsVisible = false;
      },
      deleteCharacter() {
        this.$emit('delete');
        this.hideControls();
      },
    },
  };
</script>
