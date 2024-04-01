<template lang="pug">
  .w-full.space-y-2
    h3.text-xl.font-black.uppercase.mt-6(v-if="title") {{ title }}
    InputText(v-model="name" label="name" @input="update")
    .flex.space-x-1
      InputText(v-model="trait" class="w-1/2" label="trait & range" @input="update")
      InputText(v-model="damage" class="w-1/2" label="damage dice" @input="update")
    InputText(v-model="feature" label="feature" @input="update")
</template>

<script>
  export default {
    name: 'InventoryWeapon',
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
        trait: this.modelValue.trait,
        damage: this.modelValue.damage,
        feature: this.modelValue.feature,
      };
    },
    methods: {
      update() {
        this.$emit('update:modelValue', {
          name: this.name,
          trait: this.trait,
          damage: this.damage,
          feature: this.feature,
        });
      },
    },
  };
</script>
