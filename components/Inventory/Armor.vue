<template lang="pug">
  .w-full.space-y-2
    h3.text-xl.font-black.uppercase(v-if="title") {{ title }}
    .flex.space-x-1
      InputText(
        v-model="name"
        class="w-7/12"
        label="name"
        :errors="validation ? validation.name.$errors : []"
        :required="validation !== null"
        @input="update"
      )
      InputText(
        v-model="score"
        class="w-5/12"
        label="base score"
        :errors="validation ? validation.score.$errors : []"
        :required="validation !== null"
        @input="update"
      )
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
      validation: {
        type: Object,
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
