import { defineStore } from 'pinia';

const DEBOUNCE_DELAY = 3000;
const VALID_HOMEBREW_TYPES = [
  'items',
  'weapons',
  'armor',
  'communities',
];

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      loaded: false,
      supabase: null,
      user: null,
      profile: null,
      pendingSave: [],
      savingHomebrew: false,
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
      const charactersStore = useCharactersStore();
      const itemsStore = useItemsStore();

      const { error } = await this.supabase.auth.signOut();

      this.user = null;
      charactersStore.clear();
      itemsStore.clear();

      return error;
    },
    async addHomebrew(type, id) {
      const toastStore = useToastStore();

      if (!VALID_HOMEBREW_TYPES.includes(type)) {
        toastStore.postMessage({ body: 'Invalid homebrew type' });
      } else {
        // already bookmarked
        if (this.profile[type].includes(id)) return;

        this.profile[type].push(id);
        this.pendingSave.push(id);
        this.saveHomebrew();
      }
    },
    async removeHomebrew(type, id) {
      const toastStore = useToastStore();

      if (!VALID_HOMEBREW_TYPES.includes(type)) {
        toastStore.postMessage({ body: 'Invalid homebrew type' });
      } else {
        const index = this.profile[type].indexOf(id);

        // already not bookmarked
        if (index < 0) return;

        this.profile[type].splice(index, 1);
        this.pendingSave.push(id);
        this.saveHomebrew();
      }
    },
    async saveHomebrew() {
      const toastStore = useToastStore();
      const updates = {};

      VALID_HOMEBREW_TYPES.forEach((type) => {
        updates[type] = [ ...this.profile[type] ];
      });

      this.savingHomebrew = true;

      const { error } = await this.supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', this.user.id);

      this.savingHomebrew = false;

      if (error) {
        toastStore.postMessage({ body: 'There was an error saving your collection' });
      } else {
        this.pendingSave = [];
      }
    },
  },
  debounce: {
    saveHomebrew: DEBOUNCE_DELAY,
  },
});
