<template lang="pug">
  .character-sheet
    SheetHeader(:character="character" @level-up="levelUp")
      .flex.relative(v-if="mq.mdMinus")
        NavButton(
          v-for="(button, index) in navButtons"
          :icon="button.icon"
          :style="buttonStyle"
          @click="openPage(button.icon)"
        )
        .nav-indicator.absolute.bottom-0.h-2.bg-white.pointer-events-none.transition-all.translate-y-px(
          :style="indicatorStyle"
        )
    //- Mobile/Tablet Character Sheet
    transition(v-if="mq.mdMinus" :name="transition" mode="out-in")
      .space-y-16.pb-4.py-8(
        v-if="currentPage === 'attributes'"
        class="md:space-y-0 md:flex"
      )
        .space-y-16(class="md:w-1/2")
          SheetStatistics(:character="character" :key="`${key}-statistics`")
          SheetExperience(:character="character" :key="`${key}-experience`")
        div(class="md:w-1/2")
          SheetClassFeature(:character="character")
      .space-y-8.pb-4.py-8(v-else-if="currentPage === 'equipment'")
        SheetWeapons(:character="character")
        SheetArmor(:character="character")
      .space-y-8.pb-4.py-8(
        v-else-if="currentPage === 'inventory' || mq.md && currentPage === 'equipment'"
        class="md:space-y-0 md:flex"
      )
        .space-y-8(v-if="mq.md" class="md:w-1/2")
          SheetWeapons(:character="character")
          SheetArmor(:character="character")
        .space-y-8(class="md:w-1/2")
          SheetGold(:character="character")
          SheetInventory(:character="character")
      .space-y-8.pb-4.py-8(
        v-else-if="currentPage === 'background'"
        class="md:space-y-0 md:flex"
      )
        SheetBackground(:character="character" class="md:w-1/2")
        SheetConnections(:character="character" class="md:w-1/2")
      .space-y-8.pb-4.py-8(v-else-if="currentPage === 'shapeshift'")
        SheetShapeshift(:character="character")
      .space-y-8.pb-4.py-8(v-else-if="currentPage === 'companion'")
        SheetCompanion(:character="character" :key="`${key}-companion`")
    //- Desktop Sheet
    .max-w-5xl.container.pb-16(v-else)
      SheetStatistics(:character="character" :key="`${key}-statistics`")
      .flex.space-x-12
        .space-y-12(class="w-5/12")
          SheetHealth(:character="character" :key="`${key}-health`")
          SheetExperience(:character="character" :key="`${key}-experience`")
          SheetClassFeature(:character="character")
        .space-y-6(class="w-7/12")
          .flex.space-x-6
            button.uppercase.text-sm.font-bold.transition-colors.border-b-2.text-slate-400(
              v-for="(tab, index) in tabs"
              :class="{ 'border-b-slate-800 text-slate-800': currentTabIndex === index }"
              @click="openTab(tab)"
            ) {{ tab }}
          Transition(:name="transition" mode="out-in")
            .space-y-12(v-if="currentTab === 'equipment'")
              SheetWeapons(:character="character")
              SheetArmor(:character="character")
            .space-y-12(v-else-if="currentTab === 'inventory'")
              SheetGold(:character="character")
              SheetInventory(:character="character")
            .space-y-12(v-else-if="currentTab === 'shapeshift'")
              SheetShapeshift(v-if="baseClass.alternateForms" :character="character")
            .space-y-12(v-else-if="currentTab === 'companion'")
              SheetCompanion(v-if="hasCompanion" :character="character" :key="`${key}-companion`")
    SheetSaveSpinner
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
        currentPage: 'attributes',
        currentTab: 'equipment',
      };
    },
    setup() {
      const sheetStore = useSheetStore();

      return { sheetStore };
    },
    computed: {
      ...mapState(useSheetStore, ['key']),
      ...mapState(useUserStore, ['user']),
      // character data
      hasCompanion() {
        return hasCompanion(this.character);
      },
      baseClass() {
        return CLASSES[this.character.baseClass];
      },
      // mobile nav
      navButtons() {
        const buttons = this.mq.md
          ? [{ icon: 'attributes' }, { icon: 'inventory' }, { icon: 'background' }]
          : [{ icon: 'attributes' }, { icon: 'equipment' }, { icon: 'inventory' }, { icon: 'background' }];

        if (this.baseClass.alternateForms) {
          buttons.push({ icon: 'shapeshift' });
        }

        if (this.hasCompanion) {
          buttons.push({ icon: 'companion' });
        }

        return buttons;
      },
      currentPageIndex() {
        return this.navButtons.findIndex((button) => button.icon === this.currentPage);
      },
      buttonWidth() {
        return 100 / this.navButtons.length;
      },
      buttonStyle() {
        return {
          width: `${this.buttonWidth}%`,
        };
      },
      indicatorStyle() {
        const left = this.currentPageIndex * this.buttonWidth;

        return {
          width: `${this.buttonWidth}%`,
          left: `${left}%`,
        };
      },
      // desktop tabs
      tabs() {
        const tabs = ['equipment', 'inventory'];

        if (this.baseClass.alternateForms) {
          tabs.push('shapeshift');
        }

        if (this.hasCompanion) {
          tabs.push('companion');
        }

        return tabs;
      },
      currentTabIndex() {
        return this.tabs.findIndex((tab) => tab === this.currentTab);
      },
    },
    mounted() {
      if (!this.user) {
        this.$router.push('/');
      }

      this.sheetStore.loadSheetSettings();
    },
    methods: {
      openPage(icon) {
        const index = this.navButtons.findIndex((button) => button.icon === icon);
        this.transition = index > this.currentPageIndex
          ? 'paginate-right'
          : 'paginate-left';

        this.currentPage = icon;
      },
      openTab(name) {
        const index = this.tabs.findIndex((tab) => tab === name);
        this.transition = index > this.currentTabIndex
          ? 'paginate-right'
          : 'paginate-left';

        this.currentTab = name;
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
