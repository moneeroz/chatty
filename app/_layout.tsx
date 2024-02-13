import { AuthProvider } from "@/context/AuthContext";
import useStore from "@/store/store";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

export default function RootLayoutNav() {
  const authenticated = useStore((state) => state.authenticated);
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.push("/signIn");
    }
  }, [authenticated]);

  return (
    <AuthProvider>
      <Stack screenOptions={{ contentStyle: { backgroundColor: "#fff" } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signIn" options={{ headerShown: false }} />
        <Stack.Screen name="signUp" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
