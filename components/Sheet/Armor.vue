<template lang="pug">
  BasicCard(title="Active Armor")
    .mt-6
      InventoryArmor(
        v-if="character.equipment.armor.name"
        :armor="character.equipment.armor"
      )
</template>

<script>
  export default {
    name: 'SheetArmor',
    props: {
      character: {
        type: Object,
        requried: true,
      },
    },
  };
</script>
