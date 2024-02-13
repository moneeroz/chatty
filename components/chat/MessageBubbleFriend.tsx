import { View, Text } from "react-native";
import React from "react";
import Thumbnail from "../Thumbnail";
import MessageTypingAnimation from "./MessageTypingAnimation";
import { GenaricUser } from "@/store/types";

interface Props {
  text?: string;
  friend: GenaricUser;
  typing?: boolean;
}

const MessageBubbleFriend = ({ text = "", friend, typing = false }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        paddingLeft: 16,
      }}
    >
      <Thumbnail url={friend.thumbnail} size={42} />
      <View
        style={{
          backgroundColor: "#d0d2db",
          borderRadius: 21,
          maxWidth: "75%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          marginLeft: 8,
          minHeight: 42,
        }}
      >
        {typing ? (
          <View style={{ flexDirection: "row" }}>
            <MessageTypingAnimation offset={0} />
            <MessageTypingAnimation offset={1} />
            <MessageTypingAnimation offset={2} />
          </View>
        ) : (
          <Text
            style={{
              color: "#202020",
              fontSize: 16,
              lineHeight: 18,
            }}
          >
            {text}
          </Text>
        )}
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
};

export default MessageBubbleFriend;
