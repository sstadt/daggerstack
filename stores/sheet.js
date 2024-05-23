import { defineStore } from 'pinia';

import { uuidv4 } from '~/helpers/utility';

const LS_KEY_SETTINGS = 'ds_sheet_settings';

export const useSheetStore = defineStore('sheet', {
  state: () => {
    return {
      settings: {
        selectedForm: null,
        key: uuidv4(),
      },
    };
  },
  actions: {
    loadSheetSettings() {
      if (process.client) {
        const settings = JSON.parse(localStorage.getItem(LS_KEY_SETTINGS));
        this.settings = settings || {};
      }
    },
    saveSetting(updates) {
      if (process.client) {
        const { selectedForm } = updates;
        const settings = {
          selectedForm: selectedForm || this.selectedForm,
        };

        localStorage.setItem(LS_KEY_SETTINGS, JSON.stringify(settings));
      }
    },
    refreshCharacterSheet() {
      this.key = uuidv4();
    },
  },
});
