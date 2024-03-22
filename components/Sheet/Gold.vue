<template lang="pug">
  BasicCard(title="Gold")
    .grid.grid-cols-2.gap-2.items-center
      h3.uppercase.text-sm.text-center.font-bold.text-right handfuls
      .flex
        .flex.bg-slate-300.p-1.pr-0
          InputCheckbox
          InputCheckbox
          InputCheckbox
          InputCheckbox
          InputCheckbox
      h3.uppercase.text-sm.text-center.font-bold.text-right bag
      .flex
        .flex.bg-slate-400.p-1.pr-0
          InputCheckbox
          InputCheckbox
          InputCheckbox
          InputCheckbox
      h3.uppercase.text-sm.text-center.font-bold.text-right chests
      .flex
        .flex.bg-slate-500.p-1.pr-0
          InputCheckbox
          InputCheckbox
          InputCheckbox
      h3.uppercase.text-sm.text-center.font-bold.text-right handfulls
      .flex
        .flex.bg-slate-600.p-1.pr-0
          InputCheckbox
          InputCheckbox
      h3.uppercase.text-sm.text-center.font-bold.text-right fortune
      .flex
        .flex.bg-slate-700.p-1.pr-0
          InputCheckbox
</template>

<script>
  export default {
    name: 'SheetGold',
  };
</script>
