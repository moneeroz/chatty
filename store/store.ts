import { create } from "zustand";

interface GlobalState {
  authenticated: boolean;
  user: User | {};
  login: (username: string, password: string) => void;
  logout: () => void;
}

interface User {
  id: number;
  name: string;
  username: string;
  thumbnail: string;
}

const useStore = create<GlobalState>()((set) => ({
  // -------------------
  // Authentication
  // -------------------

  authenticated: false,
  user: {},
  login: (user) => {
    set({ authenticated: true, user });
  },
  logout: () => {
    set({ authenticated: false, user: {} });
  },
}));

export default useStore;
