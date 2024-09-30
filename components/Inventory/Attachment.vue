<template lang="pug">
  .space-y-1
    .flex.justify-between.items-center.space-x-2
      p.font-bold.truncate.text-pink-800 {{ attachment.name }}
      InputCheckboxCounter.no-shrink(
        v-if="attachmentItem.charge"
        v-model="chargesUsed"
        :max="attachmentItem.charge.max"
        @click.stop
      )
    p.text-sm.text-slate-600(v-if="attachmentItem.attach.feature")
      strong {{ attachmentItem.attach.feature.name }}:
      |  {{ attachmentItem.attach.feature.description }}
</template>

<script>
  export default {
    name: 'InventoryAttachment',
  };
</script>

<script setup>
  const charactersStore = useCharactersStore();
  const itemsStore = useItemsStore();

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
    attachment: {
      type: Object,
      required: true,
    },
  });

  const chargesUsed = ref(props.attachment.chargesUsed);

  const attachmentItem = computed(() => {
    if (!this.attachment) return null;

    return itemsStore.item(this.attachment.itemId);
  });

  watch(chargesUsed, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      const index = props.character.inventory.items
        .findIndex((item) => item.id === this.attachment.id);
      const updatedAttachment = { ...props.attachment };

      updatedAttachment.chargesUsed = chargesUsed.value;
      props.character.inventory.items.splice(index, 1, updatedAttachment);
      charactersStore.saveCharacter(props.character);
    }
  });
</script>
