import { debounce } from 'ts-debounce';
import { PiniaDebounce } from '@pinia/plugin-debounce';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia.use(PiniaDebounce(debounce));
});
