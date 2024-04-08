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
    loadSavedCharacters() {
      if (process.client) {
        const list = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY))
        this.characterList = list || [];
        this.charactersLoaded = true;
      }
    },
    saveCharacter(character) {
      const index = this.characterList.find((c) => c.id === character.id);

      if (index > -1) {
        this.characterList.splice(index, 1, character);
      } else {
        this.characterList.push(character);
      }

      if (process.client) {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.characterList));
      }
    },
  },
});
