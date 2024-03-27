<template lang="pug">
  .container.p-8.space-y-8
    h2.text-center.text-2xl.font-black.uppercase.mb-2 StartingEquipment
    InventoryWeapon(title="weapon")
    InventoryArmor(title="armor")
    BasicButton.block.ml-auto(@click="$emit('next')") Next
</template>

<script>
  export default {
    name: 'BuilderStep4',
  };
</script>
