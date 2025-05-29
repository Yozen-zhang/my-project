import { defineStore } from 'pinia';

export const useStatusStore = defineStore('statusStore', {
  state: () => ({
    isLoading: false,
    loadingItem: '',
  }),
});
