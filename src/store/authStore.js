import { defineStore } from "pinia";

export const authStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    refreshToken: null,
    role: null,
    permissions: {},
  }),
  getters: {
    isAuthenticated: (state) => !!state.refreshToken,
    loggedUser: (state) => state.user,
    getRole: (state) => state.role,
    getPermissions: (state) => state.permissions,
  },
  actions: {
    login({ user, token, refreshToken, role, permissions }) {
      this.user = user;
      this.token = token;
      this.refreshToken = refreshToken;
      this.role = role;
      this.permissions = permissions;
    },
    setToken(token) {
      this.token = token;
    },
    setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken;
    },
    logout() {
      this.user = null;
      this.token = null;
      this.refreshToken = null;
      this.role = null;
      this.permissions = {};
    }
  }, 
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage, 
      },
    ],
  },
})
