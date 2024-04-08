import { defineStore } from 'pinia';

import { newCharacter } from '~/helpers/character';
import { deepMerge } from '~/helpers/object';

import { useCharactersStore } from '~/stores/characters';

export const useBuilderStore = defineStore('builder', {
  state: () => {
    return {
      isOpen: false,
      character: {},
    };
  },
  persist: true,
  getters: {
    baseClass(state) {
      return state.character.baseClass;
    },
  },
  actions: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    createCharacter(options) {
      this.character = newCharacter(options);
    },
    updateCharacter(updates) {
      this.character = deepMerge(this.character, updates);
    },
    saveCharacter() {
      const characterStore = useCharactersStore();

      characterStore.saveCharacter({ ...this.character });
      this.close();
      this.character = {};
    },
  },
});
