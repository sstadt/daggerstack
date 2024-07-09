<template lang="pug">
  div
    Head
      Title Daggerstack.com - Character Select
    CharacterSelect.character-select
</template>

<script>
  export default {
    name: 'CharacterIndexPage',
  };
</script>

<style lang="scss" scoped>
  .character-select {
    // account for the topbar
    height: calc(100vh - 38px);
  }
</style>
