<template lang="pug">
  BasicCard(title="Active Armor")
    .mt-6
      .flex.mb-4
        InputText(class="w-2/3" label="name" inline)
        InputText(class="w-1/3" label="base score" inline)
      InputText(label="feature")
</template>

<script>
  export default {
    name: 'SheetArmor',
  };
</script>
