<template lang="pug">
  .w-full.h-2.border.rounded-b.relative
    .absolute.top-0.left-0.h-full.transition-all(
      :style="indicatorStyle"
      :class="indicatorClass"
    )
</template>

<script>
  import zxcvbn from 'zxcvbn';

  export default {
    name: 'AuthPasswordStrength',
    props: {
      password: {
        type: String,
        required: true,
      },
    },
    computed: {
      strength() {
        return zxcvbn(this.password).score;
      },
      indicatorStyle() {
        return {
          width: `${Math.min(this.strength * 25, 100)}%`,
        };
      },
      indicatorClass() {
        return {
          'bg-red-700': this.strength < 2,
          'bg-amber-600': this.strength === 2,
          'bg-yellow-400': this.strength === 3,
          'bg-green-600': this.strength > 3,
        };
      },
    }
  };
</script>
