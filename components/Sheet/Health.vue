<template lang="pug">
  BasicCard.sheet-health(title="Hit Points & Stress" subtitle="Start at MINOR 6, MAJOR 11, and SEVERE 16")
    .sheet-health__thresholds.flex.items-center.justify-center.mb-6.mt-4
      .sheet-health__threshold.rounded.flex.items-center.justify-center.border.border-slate-400.shadow
        p.text-lg 1
      .px-2.py-1.bg-black
        h3.uppercase.font-bold.text-white.flex.items-center
          NuxtIcon.threshold-icon.mr-1(name="chevron-left")
          span minor
      .sheet-health__threshold.rounded.flex.items-center.justify-center.border.border-slate-400.shadow
        p.text-lg 1
      .px-2.py-1.bg-black
        h3.uppercase.font-bold.text-white.flex.items-center
          NuxtIcon.threshold-icon.mr-1(name="chevron-left")
          span major
      .sheet-health__threshold.rounded.flex.items-center.justify-center.border.border-slate-400.shadow
        p.text-lg 1
      .px-2.py-1.bg-black
        h3.uppercase.font-bold.text-white.flex.items-center
          NuxtIcon.threshold-icon.mr-1(name="chevron-left")
          span severe
    .hit-points.flex.items-center
      h3.text-lg.font-bold.uppercase.w-20 HP
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox(:disabled="true")
      InputCheckbox(:disabled="true")
      InputCheckbox(:disabled="true")
      InputCheckbox(:disabled="true")
      InputCheckbox(:disabled="true")
      InputCheckbox(:disabled="true")
    .stress.flex.items-center
      h3.text-lg.font-bold.uppercase.w-20 stress
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox(:disabled="true")
      InputCheckbox(:disabled="true")
      InputCheckbox(:disabled="true")
      InputCheckbox(:disabled="true")
</template>

<script>
  export default {
    name: 'SheetHealth',
  };
</script>

<style lang="scss" scoped>
  .sheet-health__threshold {
    height: 60px;
    width: 60px;
  }

  .threshold-icon {
    transform: translateY(1px);

    &:deep(svg) {
      height: 12px;
      width: 12px;
    }
  }
</style>
