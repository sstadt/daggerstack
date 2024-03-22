<template lang="pug">
  .container
    p Step 2
    BasicButton(@click="$emit('next')") Next
</template>

<script>
  export default {
    name: 'BuilderStep2',
  };
</script>
