import { defineStore } from 'pinia';

const LOCALSTORAGE_KEY = 'ds_character_list';
const DEBOUNCE_DELAY = 5000;

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
    },
    async loadLocalCharacters() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      // TODO: deprecate this after converting outstanding characters
      if (process.client) {
        const localList = localStorage.getItem(LOCALSTORAGE_KEY);

        if (localList) {
          const converted = JSON.parse(localList)
            .map((character) => {
              delete character.id;
              return character;
            });

          const { data, error } = await userStore.supabase
            .from('characters')
            .insert(converted)
            .select();

          if (error) {
            toastStore.postMessage({ body: error.message });
          } else {
            localStorage.removeItem(LOCALSTORAGE_KEY);
            this.characterList = [ ...data ];
          }
        }
      }
    },
    async saveCharacter(character) {
      const index = this.characterList.findIndex((c) => c.id === character.id);

      if (index > -1) {
        this.characterList.splice(index, 1, character);
      } else {
        this.characterList.push(character);
      }

      // set waiting flag
      this.pushQueued = true;
      this.pushCharacter(character.id);
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
    deleteCharacter(characterId) {
      // TODO: provide a confirm dialog before calling this
      // const index = this.characterList.findIndex((c) => c.id === characterId);

      // if (index > -1) {
      //   this.characterList.splice(index, 1);

      //   if (process.client) {
      //     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.characterList));
      //   }
      // }
    },
  },
  debounce: {
    pushCharacter: DEBOUNCE_DELAY,
  },
});
