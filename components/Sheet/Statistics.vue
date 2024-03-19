<template lang="pug">
  .sheet-statistics.flex.py-4.space-x-8.items-start
    .sheet-defenses.flex.space-x-4
      .sheet-defenses__evasion.text-center
        .p-1.border.border-slate-600.border-solid.rounded-md.flex.flex-col.items-center
          p.absolute.text-xs evasion
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500 Starts at 6
      .sheet-defenses__armor
        .p-1.border.border-slate-600.border-solid.rounded-md.flex.flex-col.items-center
          p.absolute.text-xs armor
          p.text-5xl.my-auto.py-4.px-2 1
      .sheet-defenses__durability.grid.grid-cols-3.grid-rows-3.gap-1
        input(type="checkbox")
        input(type="checkbox")
        input(type="checkbox")
        input(type="checkbox", disabled="disabled")
        input(type="checkbox", disabled="disabled")
        input(type="checkbox", disabled="disabled")
        input(type="checkbox", disabled="disabled")
        input(type="checkbox", disabled="disabled")
        input(type="checkbox", disabled="disabled")
    .sheet-attributes.flex.space-x-4.items-start
      .sheet-attributes__item.text-center
        .p-1.border.border-slate-600.border-solid.rounded-md.flex.flex-col.items-center
          p.absolute.text-xs agility
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500 Sprint
        p.text-xs.text-slate-500 Leap
        p.text-xs.text-slate-500 Maneuver
      .sheet-attributes__item.text-center
        .p-1.border.border-slate-600.border-solid.rounded-md.flex.flex-col.items-center
          p.absolute.text-xs strength
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500 Lift
        p.text-xs.text-slate-500 Smash
        p.text-xs.text-slate-500 Grapple
      .sheet-attributes__item.text-center
        .p-1.border.border-slate-600.border-solid.rounded-md.flex.flex-col.items-center
          p.absolute.text-xs finesse
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500 Control
        p.text-xs.text-slate-500 Hide
        p.text-xs.text-slate-500 Tinker
      .sheet-attributes__item.text-center
        .p-1.border.border-slate-600.border-solid.rounded-md.flex.flex-col.items-center
          p.absolute.text-xs instinct
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500 Perceive
        p.text-xs.text-slate-500 Sense
        p.text-xs.text-slate-500 Navigate
      .sheet-attributes__item.text-center
        .p-1.border.border-slate-600.border-solid.rounded-md.flex.flex-col.items-center
          p.absolute.text-xs presence
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500 Charm
        p.text-xs.text-slate-500 Perform
        p.text-xs.text-slate-500 Deceive
      .sheet-attributes__item.text-center
        .p-1.border.border-slate-600.border-solid.rounded-md.flex.flex-col.items-center
          p.absolute.text-xs knowledge
          p.text-5xl.my-auto.py-4.px-2 1
        p.text-xs.text-slate-500 Recall
        p.text-xs.text-slate-500 Analyze
        p.text-xs.text-slate-500 Comprehend
</template>

<script>
  export default {
    name: 'SheetAttributes',
  };
</script>
