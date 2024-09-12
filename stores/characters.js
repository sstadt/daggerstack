import { defineStore } from 'pinia';

import migrate from '~/helpers/migrate';

const DEBOUNCE_DELAY = 3000;

export const useCharactersStore = defineStore('characters', {
  state: () => {
    return {
      localCharacters: [],
      characterList: [],
      currentCharacter: null,
      charactersLoaded: false,
      hydrated: false,
      pushQueued: false,
      savingCharacter: false,
    };
  },
  actions: {
    async hydrate() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      const { data, error } = await userStore.supabase
        .from('characters')
        .select();

      if (error) {
        toastStore.postMessage({ body: error.message });
      } else {
        const migratedCharacters = migrate(data);

        if (migratedCharacters.length > 0) {
          toastStore.postMessage({
            body: 'Migrating your character to the latest version of the character sheet...',
          });

          this.migrateCharacters(migratedCharacters);

          return;
        }

        this.characterList = [ ...data ];
        this.hydrated = true;
      }

      return;
    },
    async migrateCharacters(characters) {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      for (let i = 0, j = characters.length; i < j; i++) {
        let { error } = await userStore.supabase
          .from('characters')
          .update(characters[i])
          .eq('id', characters[i].id);

        if (error) {
          toastStore.postMessage({ body: error.message });
        }
      }

      // grab fresh data
      this.hydrate();

      return;
    },
    async saveCharacter(character) {
      const toastStore = useToastStore();
      const index = this.characterList.findIndex((c) => c.id === character.id);

      if (index > -1) {
        this.characterList.splice(index, 1, character);

        // set waiting flag and pushed to debounced update
        this.pushQueued = true;
        this.pushCharacter(character.id);
      } else {
        toastStore.postMessage({ body: 'Character not found' });
      }

      return;
    },
    async createCharacter(character) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const { data, error } = await userStore.supabase
        .from('characters')
        .insert(character)
        .select();

      if (error) {
        toastStore.postMessage({ body: error.message });
      } else {
        const [ newCharacter ] = data;

        this.characterList.push(newCharacter);

        return newCharacter.id;
      }

      return data.id;
    },
    async pushCharacter(characterId) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const updatedCharacter = this.characterList.find((c) => c.id === characterId);

      this.pushQueued = false;
      this.savingCharacter = true;

      const { error } = await userStore.supabase
        .from('characters')
        .update(updatedCharacter)
        .eq('id', characterId);

      if (error) {
        toastStore.postMessage({ body: error.message });
      }

      this.savingCharacter = false;

      return;
    },
    async deleteCharacter(characterId) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const index = this.characterList.findIndex((c) => c.id === characterId);

      if (index > -1) {
        const { error } = await userStore.supabase
          .from('characters')
          .delete()
          .eq('id', characterId);

        this.characterList.splice(index, 1);

        if (error) {
          toastStore.postMessage({ body: error.message });
        }
      }

      return;
    },
  },
  debounce: {
    pushCharacter: DEBOUNCE_DELAY,
  },
});
