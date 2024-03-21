<template lang="pug">
  BasicCard(title="inventory")
    InputTextarea.pb-8.border-b.mb-8.mt-6(label="Items")
    .pb-8.border-b.mb-8
      h3.text-xl.font-black.uppercase.mb-4 Inventory Weapon
      InputText(label="name")
      .flex
        InputText(class="w-1/2" label="trait & range" inline)
        InputText(class="w-1/2" label="damage dice")
      InputText(label="feature")
    h3.text-xl.font-black.uppercase.mb-4 Inventory Armor
    .flex.mb-4
      InputText(class="w-2/3" label="name" inline)
      InputText(class="w-1/3" label="base score" inline)
    InputText(label="feature")
</template>

<script>
  export default {
    name: 'SheetInventory',
  };
</script>
