import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useNavigation } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Empty from "@/components/Empty";
import Thumbnail from "@/components/Thumbnail";
import useStore from "@/store/store";
import Cell from "@/components/Cell";

interface Props {
  user: {
    username: string;
    thumbnail: string | null;
    name: string;
    status: string;
  };
}

const SearchButton = ({ user }: Props) => {
  // Add a tick icon if the user is connected
  if (user.status === "connected") {
    return <FontAwesome name="check-circle" size={30} color={"#20d080"} />;
  }

  const requestConnect = useStore((state) => state.requestConnect);
  const requestAccept = useStore((state) => state.requestAccept);

  interface Data {
    text: string;
    disabled: boolean;
    onPress: () => void;
  }

  const data: Data = { text: "", disabled: false, onPress: () => {} };

  switch (user.status) {
    case "no-connection":
      data.text = "Connect";
      data.disabled = false;
      data.onPress = () => requestConnect(user.username);
      break;
    case "pending-them":
      data.text = "Pending";
      data.disabled = true;
      data.onPress = () => {};
      break;
    case "pending-me":
      data.text = "Accept";
      data.disabled = false;
      data.onPress = () => requestAccept(user.username);
      break;
    default:
      break;
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: data.disabled ? "#505050" : "#202020",
        paddingHorizontal: 14,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
      }}
      disabled={data.disabled}
      onPress={data.onPress}
    >
      <Text
        style={{
          color: data.disabled ? "#808080" : "#fff",
          fontWeight: "bold",
        }}
      >
        {data.text}
      </Text>
    </TouchableOpacity>
  );
};

const SearchRow = ({ user }: Props) => {
  return (
    <Cell>
      <Thumbnail url={user.thumbnail} size={76} />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text style={{ color: "#202020", fontWeight: "bold", marginBottom: 4 }}>
          {user.name}
        </Text>
        <Text style={{ color: "#606060" }}>{user.username}</Text>
      </View>
      <SearchButton user={user} />
    </Cell>
  );
};

const search = () => {
  const [query, setQuery] = useState("");
  const navigation = useNavigation();
  const searchList = useStore((state) => state.searchList);
  const searchUsers = useStore((state) => state.searchUsers);

  useEffect(() => {
    searchUsers(query);
  }, [query]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Search",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome name="chevron-left" size={18} color={"#70747a"} />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ padding: 16, borderBottomWidth: 1, borderColor: "#f0f0f0" }}
        >
          <View>
            <TextInput
              style={{
                fontSize: 16,
                height: 52,
                padding: 16,
                paddingLeft: 50,
                borderRadius: 26,
                backgroundColor: "#e1e2e4",
              }}
              value={query}
              onChangeText={setQuery}
              placeholder="Search..."
              placeholderTextColor="#b0b0b0"
              autoCapitalize="none"
            />
            <FontAwesome
              name="search"
              size={20}
              style={{
                position: "absolute",
                top: 17,
                left: 18,
              }}
              color={"#505050"}
            />
          </View>
        </View>

        {searchList === null ? (
          <Empty
            icon="search"
            message={"Search for friends"}
            centered={false}
          />
        ) : searchList.length === 0 ? (
          <Empty
            icon="exclamation-triangle"
            message={`No users found for "${query}" `}
            centered={false}
          />
        ) : (
          <FlatList
            data={searchList}
            renderItem={({ item }) => <SearchRow user={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default search;
