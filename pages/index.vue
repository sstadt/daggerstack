<template lang="pug">
  .index
    transition(name="fade" mode="out-in" appear)
      CharacterSheet(v-if="false")
      CharacterSelect.character-select(v-else)
</template>

<script>
  export default {
    name: 'IndexPage',
  };
</script>

<style lang="scss" scoped>
  .character-select {
    min-height: 100vh;
  }
</style>
