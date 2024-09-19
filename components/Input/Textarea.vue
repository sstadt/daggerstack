<template lang="pug">
  .input--textarea.flex.flex-col.relative(:class="wrapperClass")
    label.uppercase.font-bold.text-slate-500(
      v-if="label"
      :class="{ 'sr-only': hideLabel }"
    ) {{ label }}
    textarea.px-4.py-2.text-xl.resize-none.outline-0.overflow-hidden.border.transition-all(
      type="text"
      ref="input"
      :class="inputClass"
      :style="inputStyle"
      :value="modelValue"
      @input="inputHandler"
      @keypress="keyPress"
      @keyup="resize"
    )
    textarea.absolute.top-0.w-full.px-4.py-2.text-xl.h-0.opacity-0.m-0.overflow-hidden.pointer-events-none(
      ref="$shadow"
      :value="modelValue"
    )
    .flex.justify-between.font-bold
      transition(name="slide-fade-left")
        p.text-red-400(v-if="firstError") {{ firstError.$message }}
      p.text-slate-500.ml-auto(v-if="limit") {{ characterCount }}/{{ limit }}
</template>

<script>
  export default {
    name: 'InputTextarea',
  };
</script>

<script setup>
  const {
    useWrapperClass,
    useInputClass,
    useFirstError,
  } = useInput();
  const emit = defineEmits(['update:modelValue']);

  const props = defineProps({
    modelValue: {},
    label: {
      type: String,
      default: null,
    },
    hideLabel: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Array,
      default: [],
    },
    limit: {
      type: Number,
      default: null,
    },
  });

  const height = ref(0);
  const $shadow = ref(null);

  const wrapperClass = useWrapperClass(props.disabled);
  const inputClass = useInputClass(props.errors);
  const firstError = useFirstError(props.errors);

  const characterCount = computed(() => {
    return props.modelValue.length;
  });

  const inputStyle = computed(() => {
    return {
      height: `${height.value}px`,
    };
  });

  const resize = () => {
    height.value = $shadow.value.scrollHeight;
  };

  const keyPress = ($event) => {
    if (props.limit !== null && characterCount.value >= props.limit) {
      $event.preventDefault();

      if (characterCount.value >= props.limit) {
        emit(
          'update:modelValue',
          $event.target.value.substring(0, props.limit),
        );
      }
    }
  };

  const inputHandler = ($event) => {
    emit('update:modelValue', $event.target.value);
  };

  onMounted(() => {
    resize();
  });
</script>

<style lang="scss" scoped>
  textarea {
    min-height: 44px;
  }
</style>
