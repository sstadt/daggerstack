import { defineStore } from 'pinia';

const LS_KEY_SETTINGS = 'ds_sheet_settings';

export const useSheetStore = defineStore('sheet', {
  state: () => {
    return {
      settings: {
        selectedForm: null,
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
  },
});
