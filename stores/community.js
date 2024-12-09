import { defineStore } from 'pinia';

import { clone, cleanProfanity } from '~/helpers/utility';

import COMMUNITY from '~/data/community';

export const useCommunityStore = defineStore('community', {
  state: () => {
    return {
      communities: [ ...COMMUNITY ],
      hydrated: false,
      publicCommunities: [],
      publicHydrated: false,
    };
  },
  getters: {
    homebrew() {
      return this.communities.filter((community) => community.created_at);
    },
    community() {
      return (id) => this.communities.find((community) => community.id === id);
    },
  },
  actions: {
    async hydrate() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      const { data, error } = await userStore.supabase
        .from('homebrew_communities')
        .select()
        .or(`user_id.eq.${userStore.user.id},id.in.(${userStore.profile.community.join(',')})`);

      if (error) {
        toastStore.postMessage({ body: error.message });
      } else {
        this.communities = this.communities.concat(data);
        this.hydrated = true;
      }
    },
    async hydratePublic() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      const { data, error } = await userStore.supabase
        .from('homebrew_communities')
        .select()
        .eq('public', true)
        .neq('user_id', userStore.user.id);

      if (error) {
        toastStore.postMessage({ body: error.message });
      } else {
        this.publicCommunities = [ ...data ];
        this.publicHydrated = true;
      }
    },
    async saveArmor(armor) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const cleanArmor = cleanProfanity(armor);

      if (cleanArmor.id) {
        // update item
        const { error, data } = await userStore.supabase
          .from('homebrew_communities')
          .update(cleanArmor)
          .eq('id', cleanArmor.id)
          .select();

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const [ updatedArmor ] = data;
          const index = this.communities.findIndex((i) => i.id === updatedArmor.id);

          this.communities.splice(index, 1, updatedArmor);
          toastStore.postMessage({ body: `Saved changes to ${updatedArmor.name}` });

          return updatedArmor.id;
        }
      } else {
        // create item
        const { data, error } = await userStore.supabase
          .from('homebrew_communities')
          .insert(cleanArmor)
          .select();

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const [ newArmor ] = data;

          this.communities.push(newArmor);
          toastStore.postMessage({ body: `Created new item: ${newArmor.name}` });

          return data.id;
        }
      }

      return;
    },
    async deleteArmor(id) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const index = this.communities.findIndex((i) => i.id === id);

      if (index > -1) {
        const armorName = this.communities[index].name;
        const { error } = await userStore.supabase
          .from('homebrew_communities')
          .delete()
          .eq('id', id);

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          this.communities.splice(index, 1);
          toastStore.postMessage({ body: `Deleted ${armorName}` });
        }
      }
    },
    bookmarkAdded(id) {
      const item = this.publicCommunities.find((i) => i.id === id);
      this.communities.push(clone(item));
    },
    bookmarkRemoved(id) {
      const index = this.communities.findIndex((i) => i.id === id);
      this.communities.splice(index, 1);
    },
    clear() {
      this.communities = [ ...COMMUNITY ];
    },
  },
});
