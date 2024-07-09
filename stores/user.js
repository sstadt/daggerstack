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
      this.supabase = useSupabaseClient();
      const { data: { user } } = await this.supabase.auth.getUser();

      if (user) {
        this.user = user;
      }

      this.loaded = true;

      return;
    },
    async loggedIn() {
      const { data: { user } } = await this.supabase.auth.getUser();

      if (user) {
        this.user = user;
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
