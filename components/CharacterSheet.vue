<template lang="pug">
  .character-sheet
    SheetHeader
    SheetStatistics
    .flex.space-x-6
      .character-sheet__left(class="w-5/12")
        SheetHealth
        SheetExperience
      .character-sheet__right(class="w-7/12")
        p right col
</template>

<script>
  export default {
    name: 'CharacterSheet',
  };
</script>

<style lang="scss">
  .character-sheet__left,
  .character-sheet__right {
    & > *:not(:last-child) {
      margin-bottom: 20px;
    }
  }
</style>
