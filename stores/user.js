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
    },
  },
});
