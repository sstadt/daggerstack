import { defineStore } from 'pinia'

export const useBuilderStore = defineStore('builder', {
  state: () => {
    return {
      isOpen: false,
    };
  },
  actions: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  },
});
