import { create } from "zustand";

interface GlobalState {
  authenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

interface User {
  id: number;
  name: string;
  username: string;
  thumbnail: string | null;
  tokens: {
    access: string;
    refresh: string;
  };
}

const useStore = create<GlobalState>()((set) => ({
  // -------------------
  // Authentication
  // -------------------

  authenticated: false,
  user: null,
  login: (user) => {
    set({ authenticated: true, user });
  },
  logout: () => {
    set({ authenticated: false, user: null });
  },
}));

export default useStore;
