<template lang="pug">
  .character-sheet
    SheetHeader.mb-8(:character="character")
      .flex.relative
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
      .space-y-16.pb-4(v-if="currentIndex === 0")
        SheetStatistics(:character="character")
        SheetExperience(:character="character")
        SheetClassFeature(:character="character")
      .space-y-8.pb-4(v-else-if="currentIndex === 1")
        SheetWeapons(:character="character")
        SheetArmor(:character="character")
      .space-y-8.pb-4(v-else-if="currentIndex === 2")
        SheetGold(:character="character")
        SheetInventory(:character="character")
      .space-y-8.pb-4(v-else-if="currentIndex === 3")
        SheetBackground(:character="character")
        SheetConnections(:character="character")
</template>

<script>
  export default {
    name: 'CharacterSheet',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
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
          ? 'paginate-right'
          : 'paginate-left';

        this.currentIndex = index;
      },
    },
  };
</script>

