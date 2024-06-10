import { defineStore } from 'pinia';

import { uuidv4 } from '~/helpers/utility';

const LS_KEY_SETTINGS = 'ds_sheet_settings';

const defaultSettings = {
  levelingFanfare: true,
  selectedForm: null,
  key: uuidv4(),
};

export const useSheetStore = defineStore('sheet', {
  state: () => {
    return {
      settings: { ...defaultSettings },
    };
  },
  actions: {
    loadSheetSettings() {
      if (process.client) {
        const settings = JSON.parse(localStorage.getItem(LS_KEY_SETTINGS));
        this.settings = Object.assign(defaultSettings, settings);
        this.settingsLoaded = true;
      }
    },
    saveSetting(updates) {
      if (process.client) {
        console.log('>>> saveSettings', updates);
        this.settings = Object.assign(this.settings, updates);
        localStorage.setItem(LS_KEY_SETTINGS, JSON.stringify(this.settings));
      }
    },
    refreshCharacterSheet() {
      this.key = uuidv4();
    },
  },
});
