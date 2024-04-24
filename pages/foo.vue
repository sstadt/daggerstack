<template lang="pug">
  .foo
    .flex.bg-black.relative
      NavButton(
        v-for="(button, index) in navButtons"
        :icon="button.icon"
        class="w-1/4"
        @click="open(index)"
      )
      .nav-indicator.absolute.bottom-0.h-2.bg-white.pointer-events-none.transition-all(
        class="w-1/4"
        :style="indicatorStyle"
      )
    transition(:name="transition" mode="out-in")
      .w-full(v-if="currentIndex === 0")
        h1 Page 1
      .w-full(v-else-if="currentIndex === 1")
        h1 Page 2
      .w-full(v-else-if="currentIndex === 2")
        h1 Page 3
      .w-full(v-else-if="currentIndex === 3")
        h1 Page 4
</template>

<script>
  export default {
    name: 'Foo',
    data() {
      return {
        transition: 'paginate-right',
        currentIndex: 0,
        navButtons: [
          { icon: 'attributes' },
          { icon: 'equipment' },
          { icon: 'inventory' },
          { icon: 'background' },
        ],
      };
    },
    computed: {
      indicatorStyle() {
        const left = this.currentIndex * 25;

        return {
          left: `${left}%`,
        };
      },
    },
    methods: {
      open(index) {
        this.transition = index > this.currentIndex
          ? 'paginate-left'
          : 'paginate-right';

        this.currentIndex = index;
      },
    },
  };
</script>
