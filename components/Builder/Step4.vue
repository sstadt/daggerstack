<template lang="pug">
  .container.px-8.pb-4.space-y-8
    p Step 4
    BasicButton.block.ml-auto(@click="$emit('next')") Next
</template>

<script>
  export default {
    name: 'BuilderStep4',
  };
</script>
