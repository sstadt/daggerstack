<template lang="pug">
  .sheet-header.sticky.top-0.z-10.relative.transition-colors(:class="headerClass")
    .sheet-header__title.flex-none.py-4.px-6.text-white(@click="openDrawer")
      .sheet-header__domain-icons.flex.absolute.opacity-20.-bottom-8(class="left-1/2")
        NuxtIcon(v-for="domain in domains" :name="domain")
      h1.font-bold.text-4xl.uppercase.truncate {{ character.name }}
      p.sheet-header__details.text-slate-300.flex
        span.text-lg Level {{ character.level }} {{ character.heritage }} {{ ucFirst(character.baseClass) }}
        span.ml-auto {{ character.pronouns }}
    slot
    BasicDrawer(ref="characterDrawer" :title="tabs[currentIndex].title")
      .flex.flex-col.flex-grow
        .flex.justify-center.items-center
          button.px-3.text-4xl(
            v-for="(tab, index) in tabs"
            :class="{ 'opacity-40': currentIndex !== index }"
            @click="setTab(index)"
          )
            span.sr-only {{ tab.title }}
            NuxtIcon.tab-icon(:name="tab.icon")
        transition.my-12(:name="transition" mode="out-in")
          SheetHealth.mt-2(
            v-if="tabs[currentIndex].icon === 'health'"
            :character="character"
            :key="`${key}-health`"
          )
          SheetRest.mt-2(
            v-else-if="tabs[currentIndex].icon === 'campfire'"
            :character="character"
            @rest-complete="closeDrawer"
          )
          SheetDescription.mt-2(
            v-else-if="tabs[currentIndex].icon === 'persona'"
            :character="character"
          )
          SheetSettings.mt-2(
            v-else-if="tabs[currentIndex].icon === 'cog'"
            :character="character"
          )
        BasicCard.mt-auto
          NuxtLink(to="/")
            BasicButton.w-full(priority="secondary") Character List
</template>

<script>
  import { mapState } from 'pinia';

  import CLASSES from '~/data/classes';

  import { ucFirst } from '~/helpers/string';

  export default {
    name: 'SheetHeader',
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
        tabs: [
          { title: 'Hit Points & Stress', icon: 'health' },
          { title: 'Rest', icon: 'campfire' },
          { title: 'Persona', icon: 'persona' },
          { title: 'Settings', icon: 'cog' },
        ]
      };
    },
    computed: {
      ...mapState(useSheetStore, ['key']),
      classData() {
        return CLASSES[this.character.baseClass];
      },
      domains() {
        return this.healthPercent > 0 ? this.classData.domains : ['skull'];
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
    },
  };
</script>

<style lang="scss" scoped>
  .sheet-header__domain-icons {
    font-size: 180px;
    transform: translateX(-50%);

    &:deep(svg) {
      margin-bottom: 0;
    }
  }
</style>
