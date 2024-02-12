import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Empty from "@/components/Empty";
import Cell from "@/components/Cell";
import useStore from "@/store/store";
import Thumbnail from "@/components/Thumbnail";
import formatTime from "@/utils/formatTime";
import { Link } from "expo-router";

const FriendRow = ({ item }: any) => {
  console.log("helloooooo", item);
  return (
    <TouchableOpacity>
      <Link href={{ pathname: "/chat", params: { id: item.id } }}>
        <Cell>
          <Thumbnail url={item.friend.thumbnail} size={76} />

          <View style={{ paddingHorizontal: 16 }}>
            <Text
              style={{ color: "#202020", fontWeight: "bold", marginBottom: 4 }}
            >
              {item.friend.name}
            </Text>
            <Text style={{ color: "#606060" }}>
              {item.preview}{" "}
              <Text style={{ color: "#909090", fontSize: 13 }}>
                {formatTime(item.updated)}
              </Text>
            </Text>
          </View>
        </Cell>
      </Link>
    </TouchableOpacity>
  );
};

const chatList = () => {
  const friendList = useStore((state) => state.friendList);

  // Show loading indicator
  if (friendList === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no requests

  if (friendList.length === 0) {
    return <Empty icon="inbox" message="No messages yet" />;
  }

  // Show request list
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={friendList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <FriendRow item={item} />}
      />
    </View>
  );
};

export default chatList;
