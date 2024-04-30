<template lang="pug">
  .w-full.flex.items-stretch(
    v-touch:swipe.left="() => showControls()"
    v-touch:swipe.right="() => hideControls()"
  )
    NuxtLink.block.text-3xl.p-6.w-full.text-left.transition-all(
      class="hover:bg-slate-200 focus:bg-slate-200"
      :to="`/character/${character.id}`"
    ) {{ character.name }}
    transition(name="slide-fade-left")
      button.text-white.bg-red-600.flex.justify-center.items-center.p-4.h-auto(
        v-if="controlsVisible"
        type="button"
        @click="deleteCharacter"
      )
        NuxtIcon.text-4xl(name="explode")
</template>

<script>
  export default {
    name: 'CharacterLink',
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
