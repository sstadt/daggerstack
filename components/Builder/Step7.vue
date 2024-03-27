<template lang="pug">
  .container.px-8.pb-4.space-y-8
    p Step 7
    BasicButton.block.ml-auto(@click="$emit('next')") Next
</template>

<script>
  export default {
    name: 'BuilderStep7',
  };
</script>
