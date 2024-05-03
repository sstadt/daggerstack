<template lang="pug">
  .sheet-header.sticky.top-0.z-10.overflow-hidden.bg-black.relative
    .sheet-header__title.flex-none.py-4.px-6.text-white(@click="openHealth")
      .sheet-header__domain-icons.flex.absolute.opacity-20.-bottom-8(class="left-1/2")
        NuxtIcon(v-for="domain in domains" :name="domain")
      h1.font-bold.text-4xl.uppercase.truncate {{ character.name }}
      p.sheet-header__details.text-slate-300.flex
        span.text-lg Level {{ character.level }} {{ character.heritage }} {{ ucFirst(character.baseClass) }}
        span.ml-auto {{ character.pronouns }}
    slot
    BasicDrawer(ref="health" title="Character")
      .flex.flex-col.flex-grow
        .space-y-12
          SheetHealth(:character="character")
          SheetDescription(:character="character")
        BasicCard.mt-auto
          NuxtLink(to="/")
            BasicButton.w-full Character List
</template>

<script>
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
    computed: {
      classData() {
        return CLASSES[this.character.baseClass];
      },
      domains() {
        return this.classData.domains;
      },
    },
    methods: {
      ucFirst,
      openHealth() {
        this.$refs.health.open();
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
