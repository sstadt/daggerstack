import { defineStore } from 'pinia';


export const useUserStore = defineStore('user', {
  state: () => {
    return {
      loaded: false,
      supabase: null,
      user: null,
    };
  },
  actions: {
    async init() {
      const charactersStore = useCharactersStore();

      this.supabase = useSupabaseClient();
      const { data: { user } } = await this.supabase.auth.getUser();

      if (user) {
        this.user = user;
        await charactersStore.hydrate();
        await charactersStore.loadLocalCharacters();
      }

      this.loaded = true;

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
