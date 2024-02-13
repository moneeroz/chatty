import React, { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Slot, Tabs, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import useStore from "@/store/store";
import { useAuth } from "@/context/AuthContext";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const socketConnect = useStore((state) => state.socketConnect);
  const socketDisconnect = useStore((state) => state.socketDisconnect);

  const { authState, initialized } = useAuth();
  const { authenticated } = authState;

  const router = useRouter();

  useEffect(() => {
    socketConnect();

    return () => {
      socketDisconnect();
    };
  }, []);

  // if (!initialized) {
  //   return <Text>Loading...</Text>;
  // }

  // if (!authenticated) {
  //   return <Redirect href="/signIn" />;
  // }

  const onSearch = () => {
    router.push("/search");
  };

  return (
    <Tabs
      sceneContainerStyle={{ backgroundColor: "#fff" }}
      screenOptions={{
        tabBarActiveTintColor: "#020202",
        tabBarShowLabel: false,
        headerRight: () => (
          <TouchableOpacity onPress={onSearch}>
            <FontAwesome
              name="search"
              size={22}
              style={{ marginRight: 16 }}
              color="#404040"
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="requests"
        options={{
          title: "Friend Requests",
          tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatList"
        options={{
          title: "messages",
          tabBarIcon: ({ color }) => <TabBarIcon name="inbox" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
