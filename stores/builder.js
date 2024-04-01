import { defineStore } from 'pinia';
import { newCharacter } from '~/helpers/character';

export const useBuilderStore = defineStore('builder', {
  state: () => {
    return {
      isOpen: false,
      character: {},
    };
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
      for (let key in updates) {
        if (this.character.hasOwnProperty(key) && updates.hasOwnProperty(key)) {
          this.character[key] = updates[key];
        }
      }
    },
  },
});
