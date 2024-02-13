import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  TextInput,
  Platform,
  InputAccessoryView,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef, useState } from "react";
import Thumbnail from "@/components/Thumbnail";
import { GenaricUser } from "@/store/types";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import useStore from "@/store/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MessageHeader from "@/components/chat/MessageHeader";
import MessageBubbleMe from "@/components/chat/MessageBubbleMe";
import MessageBubbleFriend from "@/components/chat/MessageBubbleFriend";
import MessageBubble from "@/components/chat/MessageBubble";
import MessageInput from "@/components/chat/MessageInput";

const chat = () => {
  const { id } = useLocalSearchParams();
  const connectionId = Number(id);

  const [message, setMessage] = useState("");

  const messagesList = useStore((state) => state.messagesList);
  const messagesNext = useStore((state) => state.messagesNext);

  const messageList = useStore((state) => state.messageList);
  const messageSend = useStore((state) => state.messageSend);
  const messageType = useStore((state) => state.messageType);

  const friendList = useStore((state) => state.friendList);
  const connection = friendList?.find((f) => f.id === connectionId);
  const friend = connection?.friend as GenaricUser;

  const navigation = useNavigation();

  useEffect(() => {
    messageList(connectionId, 0);
  }, []);

  const onSend = () => {
    const cleaned = message.replace(/\s+/g, " ").trim();
    if (cleaned.length === 0) return;
    messageSend(connectionId, cleaned);
    setMessage("");
  };

  const onType = (value: string) => {
    setMessage(value);
    messageType(friend.username);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => <MessageHeader friend={friend} />,

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ display: Platform.OS == "ios" ? "flex" : "none" }}
            >
              <FontAwesome name="chevron-left" size={18} color={"#70747a"} />
            </TouchableOpacity>
          ),
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            marginBottom: Platform.OS === "ios" ? 60 : 0,
          }}
        >
          <FlashList
            automaticallyAdjustKeyboardInsets={true}
            contentContainerStyle={{
              paddingTop: 30,
            }}
            data={[{ id: -1 }, ...messagesList]}
            inverted={true}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={100}
            onEndReached={() => {
              console.log("onEndReached: ", messagesNext);
              if (messagesNext) {
                messageList(connectionId, Number(messagesNext));
              }
            }}
            renderItem={({ item, index }) => (
              <MessageBubble
                key={item.id}
                index={index}
                message={item}
                friend={friend}
              />
            )}
          />
        </View>

        {Platform.OS === "ios" ? (
          <InputAccessoryView>
            <MessageInput
              message={message}
              setMessage={onType}
              onSend={onSend}
            />
          </InputAccessoryView>
        ) : (
          <MessageInput message={message} setMessage={onType} onSend={onSend} />
        )}
      </SafeAreaView>
    </>
  );
};

export default chat;
