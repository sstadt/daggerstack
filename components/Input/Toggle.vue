<template lang="pug">
  .flex.items-start
    label.input--toggle.relative.inline-block.shrink-0
      input.opacity-0.w-0.h-0(type="checkbox" v-model="currentValue")
      .indicator.absolute.cursor-pointer.top-0.left-0.right-0.bottom-0
    span.text-xl.ml-2(v-if="label" :class="{ 'sr-only': hideLabel }") {{ label }}
</template>

<script>
  export default {
    name: 'InputCheckbox',
    props:{
      modelValue: {
        type: Boolean,
        required: true,
      },
      label: {
        type: String,
        default: null,
      },
      hideLabel: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        currentValue: this.modelValue,
      };
    },
    watch: {
      currentValue() {
        this.$emit('update:modelValue', this.currentValue);
      },
    },
  };
</script>

<style lang="scss" scoped>
  $height: 26px;
  $gap: 4px;
  $speed: 0.4s;
  $width: $height * 1.76;
  $indicatorSize: $height - $gap * 2;

  .input--toggle {
    width: $width;
    height: $height;
  }

  .indicator {
    background-color: #ccc;
    transition: $speed;
    border-radius: $height;

    &::before {
      border-radius: 50%;
      position: absolute;
      content: "";
      height: $indicatorSize;
      width: $indicatorSize;
      left: $gap;
      bottom: $gap;
      background-color: white;
      transition: $speed;
    }
  }

  input {
    &:checked + .indicator {
      background-color: rgb(91 33 182 / var(--tw-bg-opacity));
    }

    &:focus + .indicator {
      box-shadow: 0 0 1px rgb(91 33 182 / var(--tw-bg-opacity));
    }

    &:checked + .indicator:before {
      transform: translateX($width - ($indicatorSize + $gap * 2));
    }
  }
</style>
