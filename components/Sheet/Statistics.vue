<template lang="pug">
  .sheet-statistics
    .p-6.grid.gap-8.grid-cols-3
      BasicAttribute(title="evasion" :score="1" helper-text="Starts at 6")
      BasicAttribute(title="armor" :score="1")
      .flex.items-start.justify-center
        .sheet-durability.grid.grid-cols-3.grid-rows-3.gap-1.mt-4
          InputCheckbox
          InputCheckbox
          InputCheckbox
          InputCheckbox(:disabled="true")
          InputCheckbox(:disabled="true")
          InputCheckbox(:disabled="true")
          InputCheckbox(:disabled="true")
          InputCheckbox(:disabled="true")
          InputCheckbox(:disabled="true")
      BasicAttribute(
        title="agility"
        :score="1"
        helper-text="Sprint, Leap, Maneuver"
        modifier
        upgradeable
      )
      BasicAttribute(
        title="strength"
        :score="1"
        helper-text="Lift, Smash, Grapple"
        modifier
        upgradeable
      )
      BasicAttribute(
        title="finesse"
        :score="1"
        helper-text="Control, Hide, Tinker"
        modifier
        upgradeable
      )
      BasicAttribute(
        title="instinct"
        :score="1"
        helper-text="Perceive, Sense, Navigate"
        modifier
        upgradeable
      )
      BasicAttribute(
        title="presence"
        :score="1"
        helper-text="Charm, Perform, Deceive"
        modifier
        upgradeable
      )
      BasicAttribute(
        title="knowledge"
        :score="1"
        helper-text="Recall, Analyze, Comprehend"
        modifier
        upgradeable
      )
</template>

<script>
  export default {
    name: 'SheetAttributes',
  };
</script>
