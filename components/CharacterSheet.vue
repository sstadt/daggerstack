<template lang="pug">
  .character-sheet
    SheetHeader(:character="character" @level-up="levelUp")
      .flex.relative
        NavButton(
          v-for="(button, index) in navButtons"
          :icon="button.icon"
          :class="`w-1/${navButtons.length}`"
          @click="open(button.icon)"
        )
        .nav-indicator.absolute.bottom-0.h-2.bg-white.pointer-events-none.transition-all.translate-y-px(
          :style="indicatorStyle"
        )
    transition(:name="transition" mode="out-in")
      .space-y-16.pb-4.py-8(
        v-if="currentTab === 'attributes'"
        class="md:space-y-0 md:flex"
      )
        .space-y-16(class="md:w-1/2")
          SheetStatistics(:character="character" :key="`${key}-statistics`")
          SheetExperience(:character="character" :key="`${key}-experience`")
        div(class="md:w-1/2")
          SheetClassFeature(:character="character")
      .space-y-8.pb-4.py-8(v-else-if="currentTab === 'equipment'")
        SheetWeapons(:character="character")
        SheetArmor(:character="character")
      .space-y-8.pb-4.py-8(
        v-else-if="currentTab === 'inventory' || mq.md && currentTab === 'equipment'"
        class="md:space-y-0 md:flex"
      )
        .space-y-8(class="md:w-1/2")
          SheetWeapons(:character="character")
          SheetArmor(:character="character")
        .space-y-8(class="md:w-1/2")
          SheetGold(:character="character")
          SheetInventory(:character="character")
      .space-y-8.pb-4.py-8(
        v-else-if="currentTab === 'background'"
        class="md:space-y-0 md:flex"
      )
        SheetBackground(:character="character" class="md:w-1/2")
        SheetConnections(:character="character" class="md:w-1/2")
      .space-y-8.pb-4.py-8(v-else-if="currentTab === 'shapeshift'")
        SheetShapeshift(:character="character")
      .space-y-8.pb-4.py-8(v-else-if="currentTab === 'companion'")
        SheetCompanion(:character="character" :key="`${key}-companion`")
    BasicModal(ref="levelUpModal" :title="`Welcome to Level ${character.level + 1}!`")
      SheetLeveling(:character="character" @level-saved="levelSaved")
</template>

<script>
  import { mapState } from 'pinia';

  import { hasCompanion } from '~/helpers/character';

  import CLASSES from '~/data/classes';

  export default {
    name: 'CharacterSheet',
    inject: ['mq'],
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        transition: 'paginate-right',
        currentTab: 'attributes',
        currentIndex: 0,
      };
    },
    setup() {
      const sheetStore = useSheetStore();

      return { sheetStore };
    },
    computed: {
      ...mapState(useSheetStore, ['key']),
      navButtons() {
        const buttons = this.mq.md
          ? [{ icon: 'attributes' }, { icon: 'inventory' }, { icon: 'background' }]
          : [{ icon: 'attributes' }, { icon: 'equipment' }, { icon: 'inventory' }, { icon: 'background' }];
        const baseClass = CLASSES[this.character.baseClass];

        if (baseClass.alternateForms) {
          buttons.push({ icon: 'shapeshift' });
        }

        if (hasCompanion(this.character)) {
          buttons.push({ icon: 'companion' });
        }

        return buttons;
      },
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
      levelUp() {
        this.$refs.levelUpModal.open();
      },
      levelSaved() {
        this.$refs.levelUpModal.close();
      },
    },
  };
</script>
