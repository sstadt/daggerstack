<template lang="pug">
  .w-full.space-y-2
    h3.text-xl.font-black.uppercase.mt-6(v-if="title") {{ title }}
    InputText(label="name")
    .flex.space-x-1
      InputText(class="w-1/2" label="trait & range")
      InputText(class="w-1/2" label="damage dice")
    InputText(label="feature")
</template>

<script>
  export default {
    name: 'InventoryWeapon',
    props: {
      title: {
        type: String,
        default: null,
      },
    },
  };
</script>
