<template lang="pug">
  BasicCard(title="Experience")
    .flex.space-x-2.justify-between.text-xl.py-4.border-b
      p Cage Fighter
      p +1
    .flex.space-x-2.justify-between.text-xl.py-4.border-b
      p Street Thug
      p +1
    .hit-points.flex.items-center.pt-4
      h3.text-lg.text-slate-500.font-bold.uppercase.w-20 hope
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
      p.text-xs.text-slate-500.ml-auto.pl-2 Spend hope to use experience or help an ally
</template>

<script>
  export default {
    name: 'SheetExperience',
  };
</script>
