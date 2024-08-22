<template lang="pug">
  .w-full.h-2.border.rounded-b.relative
    .absolute.top-0.left-0.h-full.transition-all(
      :style="indicatorStyle"
      :class="indicatorClass"
    )
</template>

<script>
  export default {
    name: 'AuthPasswordStrength',
  };
</script>

<script setup>
  import zxcvbn from 'zxcvbn';

  const props = defineProps({
    password: {
      type: String,
      required: true,
    },
  });

  const strength = computed(() => {
    return zxcvbn(props.password).score;
  });

  const indicatorStyle = computed(() => {
    return {
      width: `${Math.min(strength.value * 25, 100)}%`,
    };
  });

  const indicatorClass = computed(() => {
    return {
      'bg-red-700': strength.value < 2,
      'bg-amber-600': strength.value === 2,
      'bg-yellow-400': strength.value === 3,
      'bg-green-600': strength.value > 3,
    };
  });
</script>
