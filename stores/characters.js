import { defineStore } from 'pinia';

const LOCALSTORAGE_KEY = 'ds_character_list';
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
        this.characterList = [ ...data ];
        this.hydrated = true;
      }

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
    },
  },
  debounce: {
    pushCharacter: DEBOUNCE_DELAY,
  },
});
