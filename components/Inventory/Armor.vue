<template lang="pug">
  .w-full.space-y-2
    h3.text-xl.font-black.uppercase(v-if="title") {{ title }}
    .flex.space-x-1
      InputText(
        v-model="name"
        class="w-2/3"
        label="name"
        :errors="validation ? validation.name.$errors : []"
        @input="update"
      )
      InputText(
        v-model="score"
        class="w-1/3"
        label="base score"
        :errors="validation ? validation.score.$errors : []"
        @input="update"
      )
    InputText(
      v-model="feature"
      label="feature"
      :errors="validation ? validation.feature.$errors : []"
      @input="update"
    )
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
