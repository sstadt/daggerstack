import { defineStore } from 'pinia';

import { clone, cleanProfanity } from '~/helpers/utility';

import ANCESTRY from '~/data/ancestry';

export const useAncestryStore = defineStore('ancestry', {
  state: () => {
    return {
      ancestries: [ ...ANCESTRY ],
      hydrated: false,
      publicAncestries: [],
      publicHydrated: false,
    };
  },
  getters: {
    homebrew() {
      return this.ancestries.filter((ancestry) => ancestry.created_at);
    },
    ancestry() {
      // some IDs are UUID, some are Indexes; standardize by reading all as strings
      return (id) => this.ancestries.find(
        (ancestry) => String(ancestry.id) === String(id),
      );
    },
  },
  actions: {
    async hydrate() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      const { data, error } = await userStore.supabase
        .from('homebrew_ancestries')
        .select()
        .or(`user_id.eq.${userStore.user.id},id.in.(${userStore.profile.ancestries.join(',')})`);

      if (error) {
        toastStore.postMessage({ body: error.message });
      } else {
        this.ancestries = this.ancestries.concat(data);
        this.hydrated = true;
      }
    },
    async hydratePublic() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      const { data, error } = await userStore.supabase
        .from('homebrew_ancestries')
        .select()
        .eq('public', true)
        .neq('user_id', userStore.user.id);

      if (error) {
        toastStore.postMessage({ body: error.message });
      } else {
        this.publicAncestries = [ ...data ];
        this.publicHydrated = true;
      }
    },
    async saveCommunity(ancestry) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const cleanAncestry = cleanProfanity(ancestry);

      if (cleanAncestry.id) {
        // update item
        const { error, data } = await userStore.supabase
          .from('homebrew_ancestries')
          .update(cleanAncestry)
          .eq('id', cleanAncestry.id)
          .select();

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const [ updatedAncestry ] = data;
          const index = this.ancestries.findIndex((i) => i.id === updatedAncestry.id);

          this.ancestries.splice(index, 1, updatedAncestry);
          toastStore.postMessage({ body: `Saved changes to ${updatedAncestry.name}` });

          return updatedAncestry.id;
        }
      } else {
        // create item
        const { data, error } = await userStore.supabase
          .from('homebrew_ancestries')
          .insert(cleanAncestry)
          .select();

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const [ newCommunity ] = data;

          this.ancestries.push(newCommunity);
          toastStore.postMessage({ body: `Created new item: ${newCommunity.name}` });

          return data.id;
        }
      }

      return;
    },
    async deleteCommunity(id) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const index = this.ancestries.findIndex((i) => i.id === id);

      if (index > -1) {
        const ancestryName = this.ancestries[index].name;
        const { error } = await userStore.supabase
          .from('homebrew_ancestries')
          .delete()
          .eq('id', id);

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          this.ancestries.splice(index, 1);
          toastStore.postMessage({ body: `Deleted ${ancestryName}` });
        }
      }
    },
    bookmarkAdded(id) {
      const item = this.publicAncestries.find((i) => i.id === id);
      this.ancestries.push(clone(item));
    },
    bookmarkRemoved(id) {
      const index = this.ancestries.findIndex((i) => i.id === id);
      this.ancestries.splice(index, 1);
    },
    clear() {
      this.ancestries = [ ...ANCESTRY ];
    },
  },
});
