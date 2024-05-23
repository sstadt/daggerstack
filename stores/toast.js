import { defineStore } from 'pinia';

const DEFAULT_DURATION = 10000;

// message object
// --------------------------
// NOTE: using object to make
// future extensibility easier
//
// {
//   body: String,
// }
//

export const useToastStore = defineStore('toast', {
  state: () => {
    return {
      duration: DEFAULT_DURATION,
      interval: null,
      messages: [],
    };
  },
  getters: {
    message(state) {
      const [ firstMessage ] = state.messages;
      return firstMessage && firstMessage.body
        ? { ...firstMessage }
        : null;
    },
  },
  actions: {
    postMessage(message) {
      this.messages.push({ ...message });

      if (!this.interval) {
        this.interval = setInterval(() => {
          if (this.messages.length > 0) {
            const message = this.messages.shift();
          } else {
            clearInterval(this.interval);
            this.interval = null;
          }
        }, this.duration);
      }
    },
  },
});
