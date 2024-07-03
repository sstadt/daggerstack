<template lang="pug">
  .w-full.py-3
    .flex-grow(v-if="item" @click="openDetails")
      .flex.justify-between.items-center.space-x-2
        h3.font-bold.truncate
          | {{ characterItem.name }}
          span.text-slate-400(v-if="characterItem.quantity > 1")  (x{{ characterItem.quantity }})
        .no-shrink
          BasicButton(v-if="item.consumable" size="sm" @click.stop="use") Use
          InputCheckboxCounter.no-shrink(
            v-if="item.charge"
            v-model="chargesUsed"
            :max="item.charge.max"
            @click.stop
          )
      p.text-sm.text-slate-600(v-if="item.description") {{ item.description }}
    BasicDrawer(ref="details" title="Item Details")
      .px-8.space-y-6
        h2.text-2xl.font-bold.uppercase {{ characterItem.name }}
        InputCounter.justify-between(
          label="Quantity"
          v-model="itemQuantity"
          :min="0"
        )
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
        required: true,
      },
    },
    data() {
      return {
        chargesUsed: this.characterItem.chargesUsed,
        itemQuantity: this.characterItem.quantity,
        itemNotes: this.characterItem.notes,
      };
    },
    computed: {
      item() {
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
        this.$emit('remove');
        this.$refs.details.close();
      },
      save() {
        this.$emit('update', {
          quantity: this.itemQuantity,
          notes: this.itemNotes,
        });
        this.$refs.details.close();
      },
      openDetails() {
        this.$refs.details.open();
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
