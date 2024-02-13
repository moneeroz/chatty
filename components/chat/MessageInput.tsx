import { View, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface Props {
  message: string;
  setMessage: (text: string) => void;
  onSend: () => void;
}

const MessageInput = ({ message, setMessage, onSend }: Props) => {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextInput
        placeholder="Message..."
        placeholderTextColor="#909090"
        value={message}
        onChangeText={setMessage}
        style={{
          flex: 1,
          paddingHorizontal: 18,
          borderWidth: 1,
          borderRadius: 25,
          borderColor: "#d0d0d0",
          backgroundColor: "white",
          height: 50,
        }}
      />
      <TouchableOpacity onPress={onSend}>
        <FontAwesome
          name="send"
          size={22}
          color={"#303040"}
          style={{
            marginHorizontal: 12,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;
