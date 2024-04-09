import { defineStore } from 'pinia';

import { deepMerge } from '~/helpers/object';

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
        const list = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
        this.characterList = list || [];
        this.charactersLoaded = true;
      }
    },
    updateCharacter(updates) {
      console.log('>>> updates', updates);
      const index = this.characterList.findIndex((c) => c.id === updates.id);
      console.log('>>> index', index);
      if (index > -1) {
        this.characterList.splice(index, 1, deepMerge(this.characterList[index], updates));
        console.log(this.characterList[index]);
        if (process.client) {
          localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.characterList));
        }
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
  },
});
