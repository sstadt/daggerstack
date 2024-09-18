import { defineStore } from 'pinia';

import ITEMS from '~/data/items';

export const useDataStore = defineStore('data', {
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
