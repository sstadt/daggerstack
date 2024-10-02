import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      loaded: false,
      supabase: null,
      user: null,
      profile: null,
    };
  },
  actions: {
    async init() {
      const charactersStore = useCharactersStore();

      this.supabase = useSupabaseClient();
      const { data: { user } } = await this.supabase.auth.getUser();

      if (user) {
        this.user = user;
        await this.hydrate();
        await charactersStore.hydrate();
      }

      this.loaded = true;

      return;
    },
    async hydrate() {
      const { data } = await this.supabase
        .from('user_profiles')
        .select()
        .eq('user_id', this.user.id);
      const [ profile ] = data;

      if (profile) {
        this.profile = { ...profile };
      } else {
        await this.createProfile();
      }

      return;
    },
    async createProfile() {
      const toastStore = useToastStore();
      const { data } = await this.supabase
        .from('user_profiles')
        .insert({})
        .select();
      const [ profile ] = data;

      if (profile) {
        this.profile = { ...profile };
      } else {
        toastStore.postMessage({ body: 'There was an error creating your user profile' });
      }

      return;
    },
    async loggedIn() {
      const charactersStore = useCharactersStore();
      const { data: { user } } = await this.supabase.auth.getUser();

      if (user) {
        this.user = user;
        charactersStore.hydrate();
      }

      return;
    },
    async logOut() {
      const { error } = await this.supabase.auth.signOut();

      this.user = null;

      return error;
    },
  },
});
