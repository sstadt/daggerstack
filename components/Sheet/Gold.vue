<template lang="pug">
  BasicCard(title="Gold")
    .flex.justify-center.space-x-1.mt-4.flex-wrap
      .flex.flex-col-reverse.items-center
        h3.uppercase.text-xs.text-center handfuls
        .flex.bg-slate-300.p-1.pr-0
          InputCheckbox
          InputCheckbox
          InputCheckbox
          InputCheckbox
          InputCheckbox
      .flex.flex-col-reverse.items-center
        h3.uppercase.text-xs.text-center bag
        .flex.bg-slate-400.p-1.pr-0
          InputCheckbox
          InputCheckbox
          InputCheckbox
          InputCheckbox
      .flex.flex-col-reverse.items-center
        h3.uppercase.text-xs.text-center chests
        .flex.bg-slate-500.p-1.pr-0
          InputCheckbox
          InputCheckbox
          InputCheckbox
      .flex.flex-col-reverse.items-center
        h3.uppercase.text-xs.text-center handfulls
        .flex.bg-slate-600.p-1.pr-0
          InputCheckbox
          InputCheckbox
      .flex.flex-col-reverse.items-center
        h3.uppercase.text-xs.text-center fortune
        .flex.bg-slate-700.p-1.pr-0
          InputCheckbox
</template>

<script>
  export default {
    name: 'SheetGold',
  };
</script>
