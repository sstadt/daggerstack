<template lang="pug">
  .character-sheet
    SheetHeader.mb-8(:character="character")
      .flex.relative
        NavButton(
          v-for="(button, index) in navButtons"
          :icon="button.icon"
          class="w-1/4"
          @click="open(button.icon)"
        )
        .nav-indicator.absolute.bottom-0.h-2.bg-white.pointer-events-none.transition-all.translate-y-px(
          :style="indicatorStyle"
        )
    transition(:name="transition" mode="out-in")
      .space-y-16.pb-4(v-if="currentTab === 'attributes'")
        SheetStatistics(:character="character")
        SheetExperience(:character="character")
        SheetClassFeature(:character="character")
      .space-y-8.pb-4(v-else-if="currentTab === 'equipment'")
        SheetWeapons(:character="character")
        SheetArmor(:character="character")
      .space-y-8.pb-4(v-else-if="currentTab === 'inventory'")
        SheetGold(:character="character")
        SheetInventory(:character="character")
      .space-y-8.pb-4(v-else-if="currentTab === 'background'")
        SheetBackground(:character="character")
        SheetConnections(:character="character")
      .space-y-8.pb-4(v-else-if="currentTab === 'shapeshift'")
        SheetShapeshift(:character="character")
</template>

<script>
  import CLASSES from '~/data/classes';

  export default {
    name: 'CharacterSheet',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      const navButtons = [
        { icon: 'attributes' },
        { icon: 'equipment' },
        { icon: 'inventory' },
        { icon: 'background' },
      ];
      const baseClass = CLASSES[this.character.baseClass];

      if (baseClass.alternateForms) {
        navButtons.push({ icon: 'shapeshift' });
      }

      return {
        transition: 'paginate-right',
        currentTab: navButtons[0].icon,
        currentIndex: 0,
        navButtons,
      };
    },
    computed: {
      baseClass() {
        return CLASSES[this.character.baseClass];
      },
      indicatorStyle() {
        const indicatorWidth = 100 / this.navButtons.length
        const left = this.currentIndex * indicatorWidth;

        return {
          width: `${indicatorWidth}%`,
          left: `${left}%`,
        };
      },
    },
    methods: {
      open(icon) {
        const index = this.navButtons.findIndex((button) => button.icon === icon);
        this.transition = index > this.currentIndex
          ? 'paginate-right'
          : 'paginate-left';

        this.currentTab = icon;
        this.currentIndex = index;
      },
    },
  };
</script>

