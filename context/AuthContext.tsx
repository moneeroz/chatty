import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { GenaricUser } from "@/store/types";
import useStore from "@/store/store";
import secure from "@/utils/secure";
import api from "@/store/api";

interface AuthProps {
  authState: {
    token: string | null;
    authenticated: boolean | null;
    user: GenaricUser | null;
  };
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  initialized: boolean;
}

const AuthContext = createContext<AuthProps>({
  authState: { token: null, authenticated: null, user: null },
  signIn: () => null,
  signOut: () => null,
  initialized: false,
});

// Easy access to our Provider
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);
  const [initialized, setInitialized] = useState(false);

  const router = useRouter();

  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    user: GenaricUser | null;
  }>({
    token: null,
    authenticated: null,
    user: null,
  });

  useEffect(() => {
    const autoLogin = async () => {
      // Load credentials and login on startup

      const credentials = await secure.getValueFor("credentials");

      if (credentials) {
        const { username, password } = credentials;
        signIn(username, password);

        setInitialized(true);
      }
    };
    autoLogin();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      api({
        method: "POST",
        url: "/chat/signin/",
        data: {
          username,
          password,
        },
      })
        .then((res) => {
          console.log(res.data);
          const { user, tokens } = res.data;
          login({ ...user, tokens });
          secure.save("tokens", tokens);
          secure.save("credentials", { username, password });

          setAuthState({
            token: tokens.access,
            authenticated: true,
            user: user,
          });

          router.push("/(tabs)/requests");
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
          } else if (err.request) {
            console.log(err.request);
          } else {
            console.log("Error", err.message);
          }
        });
    } catch (e) {
      return { error: true, msg: e };
    }
  };

  const signOut = async () => {
    logout();

    // Reset auth state
    setAuthState({
      token: null,
      authenticated: false,
      user: null,
    });
  };

  const value = {
    signIn,
    signOut,
    authState,
    initialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
