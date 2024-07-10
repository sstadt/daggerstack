import { defineStore } from 'pinia';

const LOCALSTORAGE_KEY = 'ds_character_list';

export const useCharactersStore = defineStore('characters', {
  state: () => {
    return {
      characterList: [],
      currentCharacter: null,
      charactersLoaded: false,
    };
  },
  actions: {
    async hydrate() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      console.log('>>> hydrating characters');
      console.log('>>> user', userStore.user.id);
      const { data, error } = await userStore.supabase
        .from('characters')
        .select();

      console.log('... data', data);
      console.log('... error', error);
    },
    loadSavedCharacters() {
      if (process.client) {
        const list = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
        this.characterList = list || [];
        this.charactersLoaded = true;
      }
    },
    saveCharacter(character) {
      const index = this.characterList.findIndex((c) => c.id === character.id);

      if (index > -1) {
        this.characterList.splice(index, 1, character);
      } else {
        this.characterList.push(character);
      }

      if (process.client) {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.characterList));
      }
    },
    deleteCharacter(characterId) {
      const index = this.characterList.findIndex((c) => c.id === characterId);

      if (index > -1) {
        this.characterList.splice(index, 1);

        if (process.client) {
          localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.characterList));
        }
      }
    },
  },
});
