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
        .or(`user_id.eq.${userStore.user.id},id.in.(${userStore.profile.communities.join(',')})`);

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
    async saveCommunity(community) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const cleanCommunity = cleanProfanity(community);

      if (cleanCommunity.id) {
        // update item
        const { error, data } = await userStore.supabase
          .from('homebrew_communities')
          .update(cleanCommunity)
          .eq('id', cleanCommunity.id)
          .select();

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const [ updatedCommunity ] = data;
          const index = this.communities.findIndex((i) => i.id === updatedCommunity.id);

          this.communities.splice(index, 1, updatedCommunity);
          toastStore.postMessage({ body: `Saved changes to ${updatedCommunity.name}` });

          return updatedCommunity.id;
        }
      } else {
        // create item
        const { data, error } = await userStore.supabase
          .from('homebrew_communities')
          .insert(cleanCommunity)
          .select();

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const [ newCommunity ] = data;

          this.communities.push(newCommunity);
          toastStore.postMessage({ body: `Created new item: ${newCommunity.name}` });

          return data.id;
        }
      }

      return;
    },
    async deleteCommunity(id) {
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
