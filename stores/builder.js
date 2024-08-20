import { defineStore } from 'pinia';

import { newCharacter } from '~/helpers/constructors';
import { deepMerge } from '~/helpers/object';

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
  },
});
