import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    ready: false,
    user: null,
    accountList: [],
    chanelList: [],
    taskList: [],
  }),
  getters: {},
  actions: {
    set(data) {
      Object.entries(data).forEach(([key, value]) => {
        this[key] = value;
      });
    },
  },
});
