<template lang="pug">
  BasicCard(title="Active Weapons")
    .flex.justify-center.mt-2.mb-4
      h3.uppercase.text-sm.font-bold.mr-4 Proficiency
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
    .pb-8.border-b.mb-8.space-y-4
      h3.text-xl.font-black.uppercase.mt-6 Primary
      InputText(label="name")
      .flex
        InputText(class="w-1/2" label="trait & range" inline)
        InputText(class="w-1/2" label="damage dice")
      InputText(label="feature")
    .space-y-4
      h3.text-xl.font-black.uppercase Secondary
      InputText(label="name")
      .flex
        InputText(class="w-1/2" label="trait & range" inline)
        InputText(class="w-1/2" label="damage dice")
      InputText(label="feature")
</template>

<script>
  export default {
    name: 'SheetWeapons',
  };
</script>
