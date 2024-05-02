import { defineStore } from 'pinia';

import { newCharacter } from '~/helpers/character';
import { deepMerge } from '~/helpers/object';

import { useCharactersStore } from '~/stores/characters';

const LS_KEY_CHARACTER = 'ds_builder_character';
const LS_KEY_PAGE = 'ds_builder_page';

export const useBuilderStore = defineStore('builder', {
  state: () => {
    return {
      character: newCharacter(),
      currentPage: 0,
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
        const page = parseInt(localStorage.getItem(LS_KEY_PAGE));

        this.character = JSON.parse(localStorage.getItem(LS_KEY_CHARACTER));
        this.currentPage = Number.isInteger(page) ? page : 0;
      }
    },
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    savePage() {
      if (process.client) {
        localStorage.setItem(LS_KEY_PAGE, this.currentPage);
      }
    },
    newCharacter(options) {
      this.character = newCharacter(options);

      if (process.client) {
        localStorage.setItem(LS_KEY_CHARACTER, JSON.stringify(this.character));
      }
    },
    updateCharacter(updates) {
      this.character = deepMerge(this.character, updates);

      if (process.client) {
        localStorage.setItem(LS_KEY_CHARACTER, JSON.stringify(this.character));
      }
    },
    createCharacter(updates = null) {
      const characterStore = useCharactersStore();
      const character = updates
        ? deepMerge(this.character, updates)
        : { ...this.character };

      characterStore.saveCharacter(character);
      this.close();
      this.character = {};

      if (process.client) {
        localStorage.setItem(LS_KEY_CHARACTER, JSON.stringify(this.character));
      }
    },
  },
});
