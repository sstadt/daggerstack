<template lang="pug">
  .w-full.py-3
    .flex-grow(v-if="item")
      .flex.justify-between.items-center.space-x-2
        h3.text-xl.font-bold.truncate {{ item.name }}
        .no-shrink
          BasicButton(v-if="item.consumable" size="sm" @click="use") Use
          InputCheckboxCounter.no-shrink(
            v-if="item.charge"
            v-model="chargesUsed"
            :max="item.charge.max"
          )
      p.text-sm.text-slate-600 {{ item.description }}
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
        console.log('>>> use item');
      },
    },
  };
</script>
