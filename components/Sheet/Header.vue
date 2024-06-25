<template lang="pug">
  .sheet-header.sticky.top-0.z-10.relative.transition-colors(:class="headerClass")
    .sheet-header__title.flex-none.py-4.px-6.text-white.cursor-pointer(
      :class="{ 'container': mq.lgPlus }"
      @click="openDrawer"
    )
      .sheet-header__domain-icons.flex.absolute.opacity-20(
        class="left-1/2 lg:left-auto lg:right-0"
        :class="domainsClass"
        :style="domainsStyle"
      )
        NuxtIcon(v-for="domain in domains" :name="domain")
      h1.font-bold.text-4xl.uppercase.truncate {{ character.name }} <span v-if="mq.lgPlus">({{ character.pronouns }})</span>
      p.sheet-header__details.text-slate-300.flex
        span.text-lg Level {{ character.level }} {{ classLabel }}
        span.ml-auto(v-if="mq.mdMinus") {{ character.pronouns }}
    slot
    BasicDrawer(ref="characterDrawer" :title="tabs[currentIndex].title")
      .flex.flex-col.flex-grow.overflow-x-hidden
        .flex.justify-center.items-center
          button.px-3.text-4xl(
            v-for="(tab, index) in tabs"
            :class="{ 'opacity-40': currentIndex !== index }"
            @click="setTab(index)"
          )
            span.sr-only {{ tab.title }}
            NuxtIcon.tab-icon(:name="tab.icon")
        transition.my-12(:name="transition" mode="out-in")
          .space-y-6.mt-2(v-if="tabs[currentIndex].icon === 'health'")
            SheetHealth.mt-2(:character="character" :key="`${key}-health`")
          .space-y-6.mt-2(v-else-if="tabs[currentIndex].icon === 'campfire'")
            SheetRest.mt-2(:character="character" @rest-complete="closeDrawer")
          .space-y-6(v-else-if="tabs[currentIndex].icon === 'persona'")
            SheetDescription.mt-2(:character="character")
            .flex.justify-center.pt-10(v-if="character.level < 10")
              BasicButton(@click="levelUp") Level Up
          .space-y-6.mt-2(v-else-if="tabs[currentIndex].icon === 'cog'")
            SheetSettings.mt-2(:character="character")
        BasicCard.mt-auto
          NuxtLink(to="/")
            BasicButton.w-full(priority="secondary") Character List
</template>

<script>
  import { mapState } from 'pinia';

  import CLASSES from '~/data/classes';

  import { ucFirst, titleCase } from '~/helpers/string';

  export default {
    name: 'SheetHeader',
    inject: ['mq'],
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        transition: 'paginate-left',
        currentIndex: 0,
      };
    },
    computed: {
      ...mapState(useSheetStore, ['key']),
      tabs() {
        const tabs = [];

        if (this.mq.mdMinus) {
          tabs.push({ title: 'Hit Points & Stress', icon: 'health' });
        }

        return tabs.concat([
          { title: 'Rest', icon: 'campfire' },
          { title: 'Persona', icon: 'persona' },
          { title: 'Settings', icon: 'cog' },
        ]);
      },
      classData() {
        return CLASSES[this.character.baseClass];
      },
      multiclassUpgrade() {
        return this.character.levelSelections
          .find((selection) => selection.type === 'multiclass');
      },
      classLabel() {
        const [ primarySubclass, secondarySubclass ] = this.character.subclass;
        const classArr = this.mq.mdMinus
          ? [ titleCase(this.character.baseClass) ]
          : [ titleCase(`${primarySubclass} ${this.character.baseClass}`) ];

        if (this.multiclassUpgrade) {
          const multiclassLabel = this.mq.mdMinus
            ? this.multiclassUpgrade.options.class
            : `${secondarySubclass} ${this.multiclassUpgrade.options.class}`;

          classArr.push(titleCase(multiclassLabel));
        }

        return classArr.join(' / ');
      },
      domains() {
        const domains = [ ...this.classData.domains ];

        if (this.multiclassUpgrade) domains.push(this.multiclassUpgrade.options.domain);

        return this.healthPercent > 0 ? domains : ['skull'];
      },
      domainsClass() {
        return {
          '-bottom-8': this.domains.length < 3,
        };
      },
      domainsStyle() {
        return {
          'font-size': this.domains.length < 3 ? '180px' : '150px',
        };
      },
      healthPercent() {
        return (1 - (this.character.health.current / this.character.health.slots)).toFixed(2);
      },
      headerClass() {
        return {
          'bg-black': this.healthPercent > 0.9,
          'bg-emerald-950': this.healthPercent > 0.7 && this.healthPercent <= 0.9,
          'bg-yellow-950': this.healthPercent > 0.3 && this.healthPercent <= 0.7,
          'bg-red-950': this.healthPercent <= 0.3,
        };
      },
    },
    methods: {
      ucFirst,
      openDrawer() {
        this.$refs.characterDrawer.open();
      },
      closeDrawer() {
        this.$refs.characterDrawer.close();
      },
      setTab(index) {
        this.transition = index < this.currentIndex
          ? 'paginate-left'
          : 'paginate-right';

        this.currentIndex = index;
      },
      levelUp() {
        this.$emit('level-up');
        this.$refs.characterDrawer.close();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .sheet-header__domain-icons {
    transform: translateX(-50%);

    &:deep(svg) {
      margin-bottom: 0;
    }
  }
</style>
