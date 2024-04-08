import { defineStore } from 'pinia';

export const useCharactersStore = defineStore('characters', {
  state: () => {
    return {
      characterList: [],
      currentCharacter: null,
    };
  },
  persist: true,
  actions: {
    saveCharacter(character) {
      const index = this.characterList.find((c) => c.id === character.id);

      if (index > -1) {
        this.characterList.splice(index, 1, character);
      } else {
        this.characterList.push(character);
      }
    },
  },
});
