import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import useStore from "@/store/store";
import Empty from "@/components/Empty";
import Cell from "@/components/Cell";
import Thumbnail from "@/components/Thumbnail";
import formatTime from "@/utils/formatTime";
import { RequestListItem } from "@/store/types";

interface Props {
  item: RequestListItem;
}

const RequestAccept = ({ item }: Props) => {
  const requestAccept = useStore((state) => state.requestAccept);

  return (
    <TouchableOpacity onPress={() => requestAccept(item.sender.username)}>
      <View
        style={{
          backgroundColor: "#202020",
          height: 36,
          paddingHorizontal: 14,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Accept</Text>
      </View>
    </TouchableOpacity>
  );
};

const RequestRow = ({ item }: Props) => {
  const message = "Requested to connect with you";
  const time = formatTime(item.created);
  return (
    <Cell>
      <Thumbnail url={item.sender.thumbnail} size={76} />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text style={{ color: "#202020", fontWeight: "bold", marginBottom: 4 }}>
          {item.sender.name}
        </Text>
        <Text style={{ color: "#606060" }}>
          {message}{" "}
          <Text style={{ color: "#909090", fontSize: 13 }}>{time}</Text>
        </Text>
      </View>

      <RequestAccept item={item} />
    </Cell>
  );
};

const requests = () => {
  const requestList = useStore((state) => state.requestList);

  // Show loading indicator
  if (requestList === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no requests

  if (requestList.length === 0) {
    return <Empty icon="bell" message="No Requests" />;
  }

  // Show request list
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={requestList}
        keyExtractor={(item) => item.sender.username}
        renderItem={({ item }) => <RequestRow item={item} />}
      />
    </View>
  );
};

export default requests;
