<template lang="pug">
  .flex.space-x-2.items-start
    h4.uppercase.text-xs.font-bold(v-if="label" class="mt-1.5") {{ label }}:
    .flex.flex-wrap
      label.px-1.border.mr-1.mb-1.transition-colors.rounded(
        v-for="option in options"
        :class="{ 'bg-slate-600 text-white': selected.includes(option) }"
      )
        input.hidden(type="checkbox" :value="option" v-model="selected" @change="update")
        span.text-sm {{ option }}
</template>

<script>
  export default {
    name: 'InputPicker',
    props: {
      modelValue: {},
      options: {
        type: Array,
        required: true,
      },
      label: {
        type: String,
        default: null,
      },
    },
    data() {
      return {
        selected: this.modelValue,
      };
    },
    methods: {
      update() {
        this.$emit('update:modelValue', this.selected);
      },
    },
  };
</script>
