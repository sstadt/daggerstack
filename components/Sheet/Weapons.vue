<template lang="pug">
  BasicCard(title="Active Weapons")
    .flex.justify-center.mt-2.mb-4
      h3.uppercase.text-sm.font-bold.mr-4 Proficiency
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
      InputCheckbox
    .pb-8.border-b.mb-8.space-y-4
      h3.text-xl.font-black.uppercase.mt-6 Primary
      InventoryWeapon(
        v-if="character.equipment.primaryWeapon.name"
        :weapon="character.equipment.primaryWeapon"
      )
    .space-y-4
      h3.text-xl.font-black.uppercase Secondary
      InventoryWeapon(
        v-if="character.equipment.secondaryWeapon.name"
        :weapon="character.equipment.secondaryWeapon"
      )
</template>

<script>
  export default {
    name: 'SheetWeapons',
    props: {
      character: {
        type: Object,
        requried: true,
      },
    },
  };
</script>
