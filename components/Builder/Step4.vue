<template lang="pug">
  .container
    p Step 4
    BasicButton(@click="$emit('next')") Next
</template>

<script>
  export default {
    name: 'BuilderStep4',
  };
</script>
