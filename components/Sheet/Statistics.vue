<template lang="pug">
  .sheet-statistics.flex.py-4.space-x-8.items-start
    .sheet-defenses.flex.space-x-4(class="w-1/3")
      .sheet-defenses__evasion.text-center(class="w-1/3")
        .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
          p.text-xs.uppercase evasion
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500.mt-1 Starts at 6
      .sheet-defenses__armor(class="w-1/3")
        .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
          p.text-xs.uppercase armor
          p.text-5xl.my-auto.py-4.px-2 1
      .sheet-defenses__durability.grid.grid-cols-3.grid-rows-3.gap-1
        InputCheckbox
        InputCheckbox
        InputCheckbox
        InputCheckbox(:disabled="true")
        InputCheckbox(:disabled="true")
        InputCheckbox(:disabled="true")
        InputCheckbox(:disabled="true")
        InputCheckbox(:disabled="true")
        InputCheckbox(:disabled="true")
    .sheet-attributes.flex.space-x-4.items-start(class="w-2/3")
      .sheet-attributes__item.text-center(class="w-1/6")
        .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
          p.text-xs.uppercase.w-full.truncate agility
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500.mt-1 Sprint
        p.text-xs.text-slate-500 Leap
        p.text-xs.text-slate-500 Maneuver
      .sheet-attributes__item.text-center(class="w-1/6")
        .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
          p.text-xs.uppercase.w-full.truncate strength
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500.mt-1 Lift
        p.text-xs.text-slate-500 Smash
        p.text-xs.text-slate-500 Grapple
      .sheet-attributes__item.text-center(class="w-1/6")
        .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
          p.text-xs.uppercase.w-full.truncate finesse
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500.mt-1 Control
        p.text-xs.text-slate-500 Hide
        p.text-xs.text-slate-500 Tinker
      .sheet-attributes__item.text-center(class="w-1/6")
        .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
          p.text-xs.uppercase.w-full.truncate instinct
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500.mt-1 Perceive
        p.text-xs.text-slate-500 Sense
        p.text-xs.text-slate-500 Navigate
      .sheet-attributes__item.text-center(class="w-1/6")
        .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
          p.text-xs.uppercase.w-full.truncate presence
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500.mt-1 Charm
        p.text-xs.text-slate-500 Perform
        p.text-xs.text-slate-500 Deceive
      .sheet-attributes__item.text-center(class="w-1/6")
        .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
          p.text-xs.uppercase.w-full.truncate knowledge
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500.mt-1 Recall
        p.text-xs.text-slate-500 Analyze
        p.text-xs.text-slate-500 Comprehend
</template>

<script>
  export default {
    name: 'SheetAttributes',
  };
</script>

<style lang="scss" scoped>
  .sheet-defenses__durability {
    width: 70px;
    height: 70px;
    margin-top: 20px;
  }
</style>
