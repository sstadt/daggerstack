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

      if (item.id) {
        // update item
        const { error, data } = await userStore.supabase
          .from('homebrew_items')
          .update(item)
          .eq('id', item.id)
          .select();

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const [ updatedItem ] = data;
          const index = this.items.findIndex((i) => i.id === updatedItem.id);

          this.items.splice(index, 1, updatedItem);
          toastStore.postMessage({ body: `Saved changes to ${item.name}` });

          return updatedItem.id;
        }
      } else {
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
          toastStore.postMessage({ body: `Created new item: ${newItem.name}` });

          return data.id;
        }
      }

      return;
    },
    async deleteItem(id) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const index = this.items.findIndex((i) => i.id === id);

      if (index > -1) {
        const itemName = this.items[index].name;
        const { error } = await userStore.supabase
          .from('homebrew_items')
          .delete()
          .eq('id', id);

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          this.items.splice(index, 1);
          toastStore.postMessage({ body: `Deleted ${itemName}` });
        }
      }
    },
  },
});