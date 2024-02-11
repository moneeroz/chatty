import { View, Text } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface Props {
  icon: any;
  message: string;
  centered?: boolean;
}

const Empty = ({ icon, message, centered = true }: Props) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: centered ? "center" : "flex-start",
        alignItems: "center",
        paddingVertical: 120,
      }}
    >
      <FontAwesome
        name={icon}
        color="#d0d0d0"
        size={100}
        style={{ marginBottom: 16 }}
      />
      <Text style={{ color: "#c3c3c3", fontSize: 16 }}>{message} </Text>
    </View>
  );
};

export default Empty;
