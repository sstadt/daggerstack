import { defineStore } from 'pinia';

import ITEMS from '~/data/items';

export const useItemsStore = defineStore('items', {
  state: () => {
    return {
      items: [ ...ITEMS.items ],
    };
  },
  getters: {
    item(id) {
      // TODO
    },
  },
});
