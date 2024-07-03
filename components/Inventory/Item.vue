<template lang="pug">
  .w-full.py-3.text-left
    .flex-grow(v-if="baseItem" @click="openDetails")
      .flex.justify-between.items-center.space-x-2
        h3.font-bold.truncate {{ baseItem.name }}
        .no-shrink(v-if="baseItem.charge")
          InputCheckboxCounter.no-shrink(
            v-model="chargesUsed"
            :max="baseItem.charge.max"
            read-only
            @click.stop
          )
      p.text-sm.text-slate-600(v-if="baseItem.description") {{ baseItem.description }}
    .flex-grow(v-else-if="item" @click="openDetails")
      .flex.justify-between.items-center.space-x-2
        h3.font-bold.truncate
          | {{ characterItem.name }}
          span.text-slate-400(v-if="characterItem.quantity > 1")  (x{{ characterItem.quantity }})
        .no-shrink
          BasicButton(v-if="item.consumable && !readOnly" size="sm" @click.stop="use") Use
          InputCheckboxCounter.no-shrink(
            v-if="item.charge"
            v-model="chargesUsed"
            :max="item.charge.max"
            :read-only="readOnly"
            @click.stop
          )
      p.text-sm.text-slate-600.truncate(v-if="item.description") {{ item.description }}
      p.text-sm.text-slate-600(v-if="characterItem.notes !== ''") {{ characterItem.notes }}
    BasicDrawer(v-if="characterItem" ref="details" title="Item Details" @close="detailsClosed")
      .px-8.space-y-6
        h2.text-2xl.font-bold.uppercase {{ characterItem.name }}
        InputCounter.justify-between(
          label="Quantity"
          v-model="itemQuantity"
          :min="0"
        )
        p.text-lg {{ item.description }}
        InputTextarea(label="notes" v-model="itemNotes")
      .flex.justify-end.space-x-2.mt-auto.px-8
        BasicButton(size="sm" priority="secondary" confirm @click="remove") Delete
        BasicButton(size="sm" @click="save") Save
</template>

<script>
  import { getItem } from '~/helpers/character';

  export default {
    name: 'InventoryItem',
    props: {
      characterItem: {
        type: Object,
        default: null,
      },
      baseItem: {
        type: Object,
        default: null,
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        deleting: false,
        chargesUsed: this.characterItem ? this.characterItem.chargesUsed : 0,
        itemQuantity: this.characterItem ? this.characterItem.quantity : 1,
        itemNotes: this.characterItem ? this.characterItem.notes : '',
      };
    },
    computed: {
      item() {
        if (this.baseItem) return null;

        return this.characterItem.custom
          ? this.characterItem
          : getItem(this.characterItem.name);
      },
    },
    methods: {
      use() {
        if (this.itemQuantity > 0) {
          this.$emit('update', { quantity: this.itemQuantity - 1 });
        } else {
          this.remove();
        }
      },
      remove() {
        this.deleting = true;
        this.$refs.details.close();
      },
      detailsClosed() {
        if (this.deleting) {
          this.$emit('remove');
        }
      },
      save() {
        this.$emit('update', {
          quantity: this.itemQuantity,
          notes: this.itemNotes,
        });
        this.$refs.details.close();
      },
      openDetails() {
        if (!this.readOnly && this.characterItem) this.$refs.details.open();
      },
    },
    watch: {
      chargesUsed(newVal, oldVal) {
        if (newVal !== oldVal && newVal > -1) {
          this.$emit('update', { chargesUsed: this.chargesUsed });
        }
      },
    },
  };
</script>
