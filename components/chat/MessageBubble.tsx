import React, { useEffect, useState } from "react";
import MessageBubbleMe from "./MessageBubbleMe";
import MessageBubbleFriend from "./MessageBubbleFriend";
import useStore from "@/store/store";
import { GenaricUser, MessageListItem } from "@/store/types";

interface Props {
  index: number;
  message: any;
  friend: GenaricUser;
}

const MessageBubble = ({ index, message, friend }: Props) => {
  const [showTyping, setShowTyping] = useState(false);

  const messagesTyping = useStore((state) => state.messagesTyping);

  useEffect(() => {
    if (index !== 0) return;
    if (messagesTyping === null) {
      setShowTyping(false);
      return;
    }
    setShowTyping(true);
    const check = setInterval(() => {
      const now = new Date();
      const ms = now.getTime() - messagesTyping.getTime();
      if (ms > 5000) {
        setShowTyping(false);
      }
    }, 1000);
    return () => clearInterval(check);
  }, [messagesTyping]);

  if (index === 0) {
    if (showTyping) {
      return <MessageBubbleFriend friend={friend} typing={true} />;
    }
    return;
  }

  return message.is_me ? (
    <MessageBubbleMe text={message.text} />
  ) : (
    <MessageBubbleFriend text={message.text} friend={friend} />
  );
};

export default MessageBubble;
