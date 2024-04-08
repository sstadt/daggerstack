import { defineStore } from 'pinia';

import { newCharacter } from '~/helpers/character';
import { deepMerge } from '~/helpers/object';

import { useCharactersStore } from '~/stores/characters';

const LOCALSTORAGE_KEY = 'ds_builder_character';

export const useBuilderStore = defineStore('builder', {
  state: () => {
    return {
      isOpen: false,
      character: {},
    };
  },
  getters: {
    baseClass(state) {
      return state.character.baseClass;
    },
  },
  actions: {
    loadSavedCharacter() {
      if (process.client) {
        this.character = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
      }
    },
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    createCharacter(options) {
      this.character = newCharacter(options);

      if (process.client) {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.character));
      }
    },
    updateCharacter(updates) {
      this.character = deepMerge(this.character, updates);

      if (process.client) {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.character));
      }
    },
    saveCharacter() {
      const characterStore = useCharactersStore();

      characterStore.saveCharacter({ ...this.character });
      this.close();
      this.character = {};

      if (process.client) {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.character));
      }
    },
  },
});
