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
    .pb-8.border-b.mb-8
      h3.text-xl.font-black.uppercase.mb-4 Primary
      .flex.mb-4
        InputText(class="w-5/12" label="name" inline)
        InputText(class="w-1/4" label="trait & range" inline)
        InputText(class="w-1/3" label="damage dice")
      InputText(label="feature")
    h3.text-xl.font-black.uppercase.mb-4 Secondary
    .flex.mb-4
      InputText(class="w-5/12" label="name" inline)
      InputText(class="w-1/4" label="trait & range" inline)
      InputText(class="w-1/3" label="damage dice")
    InputText(label="feature")
</template>

<script>
  export default {
    name: 'SheetWeapons',
  };
</script>
