<template lang="pug">
  .character-sheet
    SheetHeader(:character="character" @level-up="levelUp")
      .flex.relative(v-if="mq.mdMinus")
        NavButton(
          v-for="(button, index) in navButtons"
          :icon="button.icon"
          :style="buttonStyle"
          @click="open(button.icon)"
        )
        .nav-indicator.absolute.bottom-0.h-2.bg-white.pointer-events-none.transition-all.translate-y-px(
          :style="indicatorStyle"
        )
    //- Mobile/Tablet Character Sheet
    transition(v-if="mq.mdMinus" :name="transition" mode="out-in")
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
        .space-y-8(v-if="mq.md" class="md:w-1/2")
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
    //- Desktop Sheet
    .container.pb-16(v-else)
      SheetStatistics(:character="character" :key="`${key}-statistics`")
      .flex.space-x-8
        .space-y-12(class="w-5/12")
          SheetHealth(:character="character" :key="`${key}-health`")
          SheetExperience(:character="character" :key="`${key}-experience`")
          SheetGold(:character="character")
          SheetClassFeature(:character="character")
        .space-y-12(class="w-7/12")
          SheetWeapons(:character="character")
          SheetArmor(:character="character")
          SheetInventory(:character="character")
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
      ...mapState(useUserStore, ['user']),
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
      buttonWidth() {
        return 100 / this.navButtons.length;
      },
      buttonStyle() {
        return {
          width: `${this.buttonWidth}%`,
        };
      },
      indicatorStyle() {
        const left = this.currentIndex * this.buttonWidth;

        return {
          width: `${this.buttonWidth}%`,
          left: `${left}%`,
        };
      },
    },
    mounted() {
      if (!this.user) {
        this.$router.push('/');
      }

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
