<template lang="pug">
  BasicCard.sheet-health(title="Hit Points & Stress")
    .sheet-health__thresholds.flex.items-center.justify-center.mb-6.mt-4.space-x-4
      .threshold.flex-flex-col.shadow
        .px-2.py-1.bg-black.rounded-t.border.border-black
          h3.uppercase.font-bold.text-white.flex.items-center
            span minor
        .sheet-health__threshold.rounded-b.flex.items-center.justify-center.border.border-slate-400.border-t-0.w-full.h-14
          p.text-lg 1
      .threshold.flex-flex-col.shadow
        .px-2.py-1.bg-black.rounded-t.border.border-black
          h3.uppercase.font-bold.text-white.flex.items-center
            span major
        .sheet-health__threshold.rounded.b.flex.items-center.justify-center.border.border-slate-400.border-t-0.w-full.h-14
          p.text-lg 1
      .threshold.flex-flex-col.shadow
        .px-2.py-1.bg-black.rounded-t.border.border-black
          h3.uppercase.font-bold.text-white.flex.items-center.text-sm
            span severe
        .sheet-health__threshold.rounded-b.flex.items-center.justify-center.border.border-slate-400.border-t-0.w-full.h-14
          p.text-lg 1
    .space-y-6
      .hit-points
        h3.text-lg.font-bold.uppercase.w-20.flex-shrink-0 HP
        .flex.flex-wrap.gap-y-1
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
      .stress
        h3.text-lg.font-bold.uppercase.w-20.flex-shrink-0 stress
        .flex.flex-wrap.gap-y-1
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
  .threshold-icon {
    transform: translateY(1px);

    &:deep(svg) {
      height: 12px;
      width: 12px;
    }
  }
</style>
