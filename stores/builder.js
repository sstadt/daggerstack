import { defineStore } from 'pinia';
import { newCharacter } from '~/helpers/character';

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
    updateInventory(updates) {
      for (let key in updates) {
        if (this.character.inventory.hasOwnProperty(key) && updates.hasOwnProperty(key)) {
          this.character.inventory[key] = updates[key];
        }
      }
    },
    updateEquipment({ weapon, armor }) {
      if (weapon) this.character.equipment.weapon = weapon;
      if (armor) this.character.equipment.armor = armor;
    },
  },
});
