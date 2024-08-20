<template lang="pug">
  .w-full
    .flex.space-x-2.justify-between
      h3.text-lg.font-bold.truncate(:class="titleClass") {{ armor.name }}
      p.text-lg {{ armor.score }}
    p.text-sm.text-slate-600(v-if="armor.feature")
      span.font-bold.mr-1 {{ armor.feature.label }}
      span.italic {{ armor.feature.description }}
    InventoryAttachment(
      v-if="attachment"
      :character="character"
      :attachment="attachment"
    )
</template>

<script>
  export default {
    name: 'InventoryArmor',
    props: {
      armor: {
        type: Object,
        required: true,
      },
      character: {
        type: Object,
        default: null,
      },
      characterArmor: {
        type: Object,
        default: null,
      },
    },
    computed: {
      attachment() {
        if (!this.characterArmor || !this.character) return null;

        return this.character.inventory.items.find((item) => {
          return item.attachment === this.characterArmor.id;
        });
      },
      titleClass() {
        return {
          'text-blue-600': this.armor.tier === 2,
          'text-purple-700': this.armor.tier === 3,
          'text-orange-600': this.armor.tier === 4,
        };
      },
    },
  };
</script>
