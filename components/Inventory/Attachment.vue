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
  import { getItem } from '~/helpers/character';

  export default {
    name: 'InventoryAttachment',
    props: {
      character: {
        type: Object,
        required: true,
      },
      attachment: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        chargesUsed: this.attachment.chargesUsed,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      attachmentItem() {
        if (!this.attachment) return null;

        return getItem(this.attachment.name);
      },
    },
    watch: {
      chargesUsed(newVal, oldVal) {
        if (newVal !== oldVal) {
          const index = this.character.inventory.items
            .findIndex((item) => item.id === this.attachment.id);
          const updatedAttachment = { ...this.attachment };

          updatedAttachment.chargesUsed = this.chargesUsed;
          this.character.inventory.items.splice(index, 1, updatedAttachment);
          this.charactersStore.saveCharacter(this.character);
        }
      },
    },
  };
</script>
