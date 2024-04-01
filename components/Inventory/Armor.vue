<template lang="pug">
  .w-full.space-y-2
    h3.text-xl.font-black.uppercase(v-if="title") {{ title }}
    .flex.space-x-1
      InputText(v-model="name" class="w-2/3" label="name" @input="update")
      InputText(v-model="score" class="w-1/3" label="base score" @input="update")
    InputText(v-model="feature" label="feature" @input="update")
</template>

<script>
  export default {
    name: 'InventoryArmor',
    props: {
      modelValue: { type: Object },
      title: {
        type: String,
        default: null,
      },
    },
    data() {
      return {
        name: this.modelValue.name,
        score: this.modelValue.score,
        feature: this.modelValue.feature,
      };
    },
    methods: {
      update() {
        this.$emit('update:modelValue', {
          name: this.name,
          score: this.score,
          feature: this.feature,
        });
      },
    },
  };
</script>
