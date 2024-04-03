<template lang="pug">
  .text-center
    .shadow.border.border-slate-400.border-solid.rounded-md.flex.flex-col.items-center
      .bg-black.px-2.rounded-t.flex.justify-center.items-center.space-x-1.w-full(class="py-0.5")
        label.text-xs.uppercase.font-bold.text-white.truncate(v-if="label") {{ label }}
      select.text-3xl.my-auto.py-4.px-2.w-full.rounded.text-center.outline-0(
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-5/6"
        :class="inputClass"
      )
        option
        option(v-for="option in options" :value="option.value") {{ option.label }}
    p.text-xs.text-slate-500.mt-1 {{ helperText }}
</template>

<script>
  import Select from '~/components/Input/Select.vue';

  export default {
    name: 'TraitSelect',
    extends: Select,
    props: {
      helperText: {
        type: String,
        defaul: null,
      },
    },
    computed: {
      inputClass() {
        return {
          'focus:bg-slate-200': this.errors.length === 0,
          'bg-red-100 focus:bg-red-200': this.errors.length > 0
        };
      },
    },
  };
</script>
