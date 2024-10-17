<template lang="pug">
  .sheet-header.sticky.top-0.z-10.relative.transition-colors(:class="headerClass")
    .max-w-5xl.container.sheet-header__title.flex-none.py-4.text-white.cursor-pointer(
      :class="{ 'container': mq.lgPlus }"
      @click="openDrawer"
    )
      .sheet-header__domain-icons.flex.absolute.opacity-20.pointer-events-none.-translate-y-8(
        class="left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 md:-translate-y-8 lg:-translate-x-1/2 lg:translate-y-0"
        :class="domainsClass"
        :style="domainsStyle"
      )
        NuxtIcon(v-for="domain in domains" :name="domain")
      h1.font-bold.text-4xl.uppercase.truncate(
        v-resize-text="{ ratio: 0.8, maxFontSize: '36px' }"
      ) {{ character.name }} <span v-if="mq.mdPlus">({{ character.pronouns }})</span>
      p.sheet-header__details.text-slate-300.flex
        span.text-lg Level {{ character.level }} {{ classLabel }}
        span.ml-auto(v-if="mq.sm") {{ character.pronouns }}
    slot
    BasicDrawer(ref="characterDrawer" :title="tabs[currentIndex].title")
      .flex.flex-col.flex-grow.flex-shrink-0.overflow-x-hidden(class="lg:px-8")
        .flex.justify-center.items-center
          button.px-3.text-4xl(
            v-for="(tab, index) in tabs"
            :class="{ 'opacity-40': currentIndex !== index }"
            @click="setTab(index)"
          )
            span.sr-only {{ tab.title }}
            NuxtIcon.tab-icon(:name="tab.icon")
        transition.my-12(:name="transition" mode="out-in")
          .space-y-6.mt-2(v-if="tabs[currentIndex].icon === 'buff'")
            SheetStatusEffects(:character="character")
          .space-y-6.mt-2(v-else-if="tabs[currentIndex].icon === 'campfire'")
            SheetRest.mt-2(:character="character" @rest-complete="closeDrawer")
          .space-y-6(v-else-if="tabs[currentIndex].icon === 'persona'")
            SheetDescription.mt-2(:character="character")
            .p-8(v-if="character.level < 10")
              BasicButton.w-full(@click="levelUp") Level Up
          .space-y-6.mt-2(v-else-if="tabs[currentIndex].icon === 'background'")
            SheetBackground(:character="character")
            SheetConnections(:character="character")
          .space-y-6.mt-2(v-else-if="tabs[currentIndex].icon === 'cog'")
            SheetSettings.mt-2(:character="character")
</template>

<script>
  export default {
    name: 'SheetHeader',
  };
</script>

<script setup>
  import { useMq } from 'vue3-mq';

  import CLASSES from '~/data/classes';

  import { ucFirst, titleCase } from '~/helpers/string';

  const userStore = useUserStore();
  const toastStore = useToastStore();
  const sheetStore = useSheetStore();

  const mq = useMq();
  const { getFeaturesByAttribute, calculateModifiers } = useSheetBonuses();

  const emit = defineEmits(['level-up']);

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const transition = ref('paginate-left');
  const currentIndex = ref(0);
  const characterDrawer = ref(null);

  const tabs = computed(() => {
    const tabs = [];

    tabs.push({ title: 'Rest', icon: 'campfire' });
    tabs.push({ title: 'Status Effects', icon: 'buff' });
    tabs.push({ title: 'Persona', icon: 'persona' });

    if (mq.lgPlus) {
      tabs.push({ title: 'Background', icon: 'background' })
    }

    tabs.push({ title: 'Settings', icon: 'cog' });

    return tabs;
  });

  const classData = computed(() => {
    return CLASSES[props.character.baseClass];
  });

  const multiclassUpgrade = computed(() => {
    return props.character.levelSelections
      .find((selection) => selection.type === 'multiclass');
  });

  const classLabel = computed(() => {
    const [ primarySubclass, secondarySubclass ] = props.character.subclass;
    const classArr = mq.mdMinus
      ? [ titleCase(props.character.baseClass) ]
      : [ titleCase(`${primarySubclass} ${props.character.baseClass}`) ];

    if (multiclassUpgrade.value) {
      const multiclassLabel = mq.mdMinus
        ? multiclassUpgrade.value.options.class
        : `${secondarySubclass} ${multiclassUpgrade.value.options.class}`;

      classArr.push(titleCase(multiclassLabel));
    }

    return classArr.join(' / ');
  });

  const domains = computed(() => {
    const domains = [ ...classData.value.domains ];

    if (multiclassUpgrade.value) domains.push(multiclassUpgrade.value.options.domain);

    return healthPercent.value > 0 ? domains : ['skull'];
  });

  const domainsClass = computed(() => {
    return {
      '-bottom-8': domains.value.length < 3,
    };
  });

  const domainsStyle = computed(() => {
    return {
      'font-size': domains.value.length < 3 ? '180px' : '150px',
    };
  });

  const healthSlots = computed(() => {
    const healthSlotBonuses = getFeaturesByAttribute(props.character, 'healthSlot');

    return props.character.health.slots +
      calculateModifiers(healthSlotBonuses, 'healthSlot');
  });

  const healthPercent = computed(() => {
    return (1 - (props.character.health.current / healthSlots.value)).toFixed(2);
  });

  const headerClass = computed(() => {
    return {
      'bg-black': healthPercent.value > 0.9,
      'bg-emerald-950': healthPercent.value > 0.7 && healthPercent.value <= 0.9,
      'bg-yellow-950': healthPercent.value > 0.3 && healthPercent.value <= 0.7,
      'bg-red-950': healthPercent.value <= 0.3,
    };
  });

  const openDrawer = () => {
    characterDrawer.value.open();
  };

  const closeDrawer = () => {
    characterDrawer.value.close();
  };

  const setTab = (index) => {
    transition.value = index < currentIndex.value
      ? 'paginate-left'
      : 'paginate-right';

    currentIndex.value = index;
  };

  const levelUp = () => {
    emit('level-up');
    characterDrawer.value.close();
  };
</script>

<style lang="scss" scoped>
  .sheet-header__domain-icons:deep(svg) {
    margin-bottom: 0;
  }
</style>
