<template lang="pug">
  .w-full.space-y-2
    h3.text-xl.font-black.uppercase(v-if="title") {{ title }}
    .flex
      InputText(class="w-2/3" label="name" inline)
      InputText(class="w-1/3" label="base score" inline)
    InputText(label="feature")
</template>

<script>
  export default {
    name: 'InventoryArmor',
    props: {
      title: {
        type: String,
        default: null,
      },
    },
  };
</script>
