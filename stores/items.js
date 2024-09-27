import { defineStore } from 'pinia';

import ITEMS from '~/data/items';

export const useItemsStore = defineStore('items', {
  state: () => {
    return {
      items: [ ...ITEMS.items ],
    };
  },
  getters: {
    homebrew() {
      return this.items.filter((item) => item.created_at);
    },
    item() {
      return (id) => this.items.find((item) => item.id === id);
    },
  },
  actions: {
    async hydrate() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      const { data, error } = await userStore.supabase
        .from('homebrew_items')
        .select();

      if (error) {
        toastStore.postMessage({ body: error.message });
      } else {
        this.items = this.items.concat(data);
      }
    },
    async saveItem(item) {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      if (!item.id) {
        // create item
        const { data, error } = await userStore.supabase
          .from('homebrew_items')
          .insert(item)
          .select();

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const [ newItem ] = data;

          this.items.push(newItem);

          return data.id;
        }
      } else {
        // update item
        const { error } = await userStore.supabase
          .from('homebrew_items')
          .update(item)
          .eq('id', item.id);

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const index = this.items.findIndex((i) => i.id === item.id);
          this.items.splice(index, 1, item);

          return item.id;
        }
      }

      return;
    },
  },
});
