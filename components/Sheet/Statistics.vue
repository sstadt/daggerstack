<template lang="pug">
  .sheet-statistics.py-4.grid.gap-2.grid-rows-3.grid-cols-3
    .sheet-evasion.text-center
      .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
        p.text-xs.uppercase.font-bold evasion
        p.text-5xl.my-auto.py-4.px-2 1
      p.text-xs.text-slate-500.mt-1 Starts at 6
    .sheet-armor
      .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
        p.text-xs.uppercase.font-bold armor
        p.text-5xl.my-auto.py-4.px-2 1
    .flex.items-start.justify-center
      .sheet-durability.grid.grid-cols-3.grid-rows-3.gap-1.mt-6
        InputCheckbox
        InputCheckbox
        InputCheckbox
        InputCheckbox(:disabled="true")
        InputCheckbox(:disabled="true")
        InputCheckbox(:disabled="true")
        InputCheckbox(:disabled="true")
        InputCheckbox(:disabled="true")
        InputCheckbox(:disabled="true")
    .sheet-attribute.text-center
      .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
        p.text-xs.uppercase.w-full.truncate.font-bold agility
        p.text-5xl.my-auto.py-4.px-2 1
      p.text-xs.text-slate-500.mt-1 Sprint, Leap, Maneuver
    .sheet-attribute.text-center
      .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
        p.text-xs.uppercase.w-full.truncate.font-bold strength
        p.text-5xl.my-auto.py-4.px-2 1
      p.text-xs.text-slate-500.mt-1 Lift, Smash, Grapple
    .sheet-attribute.text-center
      .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
        p.text-xs.uppercase.w-full.truncate.font-bold finesse
        p.text-5xl.my-auto.py-4.px-2 1
      p.text-xs.text-slate-500.mt-1 Control, hide, Tinker
    .sheet-attribute.text-center
      .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
        p.text-xs.uppercase.w-full.truncate.font-bold instinct
        p.text-5xl.my-auto.py-4.px-2 1
      p.text-xs.text-slate-500.mt-1 Perceive, Sense, Navigate
    .sheet-attribute.text-center
      .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
        p.text-xs.uppercase.w-full.truncate.font-bold presence
        p.text-5xl.my-auto.py-4.px-2 1
      p.text-xs.text-slate-500.mt-1 Charm, Perform, Deceive
    .sheet-attribute.text-center
      .p-1.shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
        p.text-xs.uppercase.w-full.truncate.font-bold knowledge
        p.text-5xl.my-auto.py-4.px-2 1
      p.text-xs.text-slate-500.mt-1 Recall, Analyze, Comprehend
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
