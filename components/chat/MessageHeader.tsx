import { View, Text } from "react-native";
import React from "react";
import { GenaricUser } from "@/store/types";
import Thumbnail from "../Thumbnail";

const MessageHeader = ({ friend }: { friend: GenaricUser }) => {
  return (
    <View
      style={{
        // flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Thumbnail url={friend.thumbnail} size={30} />
      <Text
        style={{
          color: "#202020",
          marginLeft: 10,
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {friend.name}
      </Text>
    </View>
  );
};

export default MessageHeader;
