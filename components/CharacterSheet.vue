<template lang="pug">
  .character-sheet
    SheetHeader(:character="character")
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
      .space-y-16.pb-4.py-8(v-if="currentTab === 'attributes'")
        SheetStatistics(:character="character")
        SheetExperience(:character="character")
        SheetClassFeature(:character="character")
      .space-y-8.pb-4.py-8(v-else-if="currentTab === 'equipment'")
        SheetWeapons(:character="character")
        SheetArmor(:character="character")
      .space-y-8.pb-4.py-8(v-else-if="currentTab === 'inventory'")
        SheetGold(:character="character")
        SheetInventory(:character="character")
      .space-y-8.pb-4.py-8(v-else-if="currentTab === 'background'")
        SheetBackground(:character="character")
        SheetConnections(:character="character")
      .space-y-8.pb-4.py-8(v-else-if="currentTab === 'shapeshift'")
        SheetShapeshift(:character="character")
      .space-y-8.pb-4.py-8(v-else-if="currentTab === 'companion'")
        SheetCompanion(:character="character")
</template>

<script>
  import CLASSES from '~/data/classes';

  import { useSheetStore } from '~/stores/sheet';
  import { hasCompanion } from '~/helpers/character';

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

      if (hasCompanion(this.character)) {
        navButtons.push({ icon: 'companion' });
      }

      return {
        transition: 'paginate-right',
        currentTab: navButtons[0].icon,
        currentIndex: 0,
        navButtons,
      };
    },
    setup() {
      const sheetStore = useSheetStore();

      return { sheetStore };
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
    mounted() {
      this.sheetStore.loadSheetSettings();
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

