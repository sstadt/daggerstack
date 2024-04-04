import { defineStore } from 'pinia';
import { newCharacter } from '~/helpers/character';
import { deepMerge } from '~/helpers/object';

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
      console.log('save to characters store');
    },
  },
});
