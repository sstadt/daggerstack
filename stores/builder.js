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
  },
});
