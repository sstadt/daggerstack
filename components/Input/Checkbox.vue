<template lang="pug">
  label.input--checkbox(:class="{ 'disabled': disabled }")
    input(type="checkbox" :name="name" :disabled="disabled")
    span(v-if="label") {{ label }}
</template>

<script>
  export default {
    name: 'InputCheckbox',
    props: {
      label: {
        type: String,
        default: null,
      },
      name: {
        type: String,
        default: null,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style lang="scss" scoped>
  $width: 20px;
  $height: $width * 0.85;
  $column: $width * 0.8;
  $gap: 8px;

  .input--checkbox {
    display: grid;
    grid-template-columns: $column auto;
    gap: $gap;

    &.disabled {
      pointer-events: none;
      opacity: 0.2;
    }
  }

  input[type="checkbox"] {
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    margin: 0;
    color: currentColor;
    width: $width;
    height: $height;
    border: 2px solid currentColor;
    border-radius: 0.1em;
    display: grid;
    place-content: center;

    &[disabled="disabled"] {
      border-style: dashed;
    }
  }

  input[type="checkbox"]::before {
    content: "";
    width: 14px;
    height: 11px;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    background-color: currentColor;
  }

  input[type="checkbox"]:checked::before {
    transform: scale(1);
  }
</style>
