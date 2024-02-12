import secure from "@/utils/secure";
import { create } from "zustand";
import { ADDRESS } from "./api";
import {
  FriendListItem,
  MessageListItem,
  RequestListItem,
  SearchUser,
  User,
} from "./types";

interface GlobalState {
  authenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  socket: WebSocket | null;
  socketConnect: () => void;
  socketDisconnect: () => void;
  uploadThumbnail: (file: any) => void;
  searchList: SearchUser[] | null;
  searchUsers: (query: string) => void;
  requestList: RequestListItem[] | null;
  requestConnect: (username: string) => void;
  requestAccept: (username: string) => void;
  friendList: FriendListItem[] | null;
  messageSend: (connectionId: number, message: string) => void;
  messageList: (connectionId: number, page: number) => void;
  messagesList: MessageListItem[];
  messagesUsername: string | null;
  messageType: (username: string) => void;
  messagesTyping: Date | null;
  messagesNext: number | null;
}

// ----------------------------
// Socket receive handlers
// ----------------------------'

const responseFriendList = (get: any, set: any, friendList: any) => {
  set({ friendList });
};

const responseFriendNew = (get: any, set: any, friend: any) => {
  const friendList = [friend, ...get().friendList];
  set({ friendList });
};

const responseMessageList = (get: any, set: any, data: any) => {
  set({
    messagesList: [...get().messagesList, ...data.messages],
    messagesNext: data.next,
    messagesUsername: data.friend.username,
  });
};

const responseMessageSend = (get: any, set: any, data: any) => {
  const username = data.friend.username;
  // Move friendlist item to the top, update preview text and timestamp
  const friendList = [...get().friendList];
  const friendIndex = friendList.findIndex(
    (f) => f.friend.username === username,
  );

  if (friendIndex !== -1) {
    const friend = friendList[friendIndex];
    friend.preview = data.message.text;
    friend.updated = data.message.created;
    friendList.splice(friendIndex, 1);
    friendList.unshift(friend);
    set({ friendList });
  }

  // If the message does not belong to this friend,
  // do not update the messagesList since a fresh one will be loaded the next time the user navigates to the correct chat
  if (get().messagesUsername !== username) {
    return;
  }

  const messagesList = [data.message, ...get().messagesList];
  set({ messagesList, messagesTyping: null });
};

const responseMessageType = (get: any, set: any, data: any) => {
  if (data.username !== get().messagesUsername) return;

  set({ messagesTyping: new Date() });
};

const responseRequestAccept = (get: any, set: any, connection: any) => {
  const user = get().user;

  // if we were the ones who accepted the request
  // remove request from requestList
  if (user.username === connection.receiver.username) {
    const requestList = [...get().requestList];
    const requestIndex = requestList.findIndex(
      (req) => req.id === connection.id,
    );
    if (requestIndex !== -1) {
      requestList.splice(requestIndex, 1);
      set({ requestList });
    }
  }
  // if the corresponding user is in the searchList for the acceptor or aceptee
  // update the state of the searchList item
  const sl = get().searchList;
  if (sl === null) return;

  const searchList = [...sl];
  let searchIndex = -1;

  if (user.username === connection.receiver.username) {
    searchIndex = searchList.findIndex(
      (user) => user.username === connection.sender.username,
    );
    // if the user accepted
  } else {
    searchIndex = searchList.findIndex(
      (user) => user.username === connection.receiver.username,
    );
  }

  if (searchIndex !== -1) {
    searchList[searchIndex].status = "connected";
    set({ searchList });
  }
};

const responseRequestConnect = (get: any, set: any, connection: any) => {
  const user = get().user;
  // if I was the one who sent the connect request,
  // update the seacrList row
  if (user.username === connection.sender.username) {
    const searchList = [...get().searchList];
    const searchIndex = searchList.findIndex(
      (req) => req.username === connection.receiver.username,
    );
    if (searchIndex !== -1) {
      searchList[searchIndex].status = "pending-them";
      set({ searchList });
    }
    // if we were not the ones who sent the request
  } else {
    const requestList = [...get().requestList];
    const requestIndex = requestList.findIndex(
      (req) => req.sender.username === connection.sender.username,
    );
    if (requestIndex === -1) {
      requestList.unshift(connection);
      set({ requestList });
    }
  }
};

const responseRequestList = (get: any, set: any, requestList: any) => {
  set({ requestList: requestList });
};

const responseSearch = (get: any, set: any, data: any) => {
  console.log(data);
  set({ searchList: data });
};

const responseThumbnail = (get: any, set: any, data: any) => {
  set({ user: data });
};

// ----------------------------

const useStore = create<GlobalState>()((set, get) => ({
  // -------------------
  // Authentication
  // -------------------

  authenticated: false,
  user: null,
  login: (user) => {
    secure.save("tokens", user.tokens);
    set({ authenticated: true, user });
  },
  logout: () => {
    secure.remove("tokens");
    set({ authenticated: false, user: null });
  },

  // -------------------
  // Websocket
  // -------------------

  socket: null,

  socketConnect: async () => {
    const tokens = await secure.getValueFor("tokens");
    if (!tokens) {
      return;
    }

    const socket = new WebSocket(
      `ws://${ADDRESS}/chat/?token=${tokens.access}`,
    );

    socket.onopen = () => {
      console.log("Socket connected");

      socket.send(JSON.stringify({ source: "request.list" }));

      socket.send(JSON.stringify({ source: "friend.list" }));
    };

    socket.onerror = (err) => {
      console.log("Socket error", err);
    };

    socket.onmessage = (event) => {
      // Convert data to JS object
      const parsed = JSON.parse(event.data);
      console.log("Socket message", parsed);

      const responses: {
        [key: string]: (get: any, set: any, data: any) => void;
      } = {
        "friend.list": responseFriendList,
        "friend.new": responseFriendNew,
        "message.list": responseMessageList,
        "message.send": responseMessageSend,
        "message.type": responseMessageType,
        "request.accept": responseRequestAccept,
        "request.connect": responseRequestConnect,
        "request.list": responseRequestList,
        "user.search": responseSearch,
        "user.thumbnail": responseThumbnail,
      };

      const res = responses[parsed.source];

      if (!res) {
        console.log("parsed.source" + " " + parsed.source + " not found");
        return;
      }

      // Call the response function
      res(get, set, parsed.data);
    };

    socket.onclose = () => {
      const socket = get().socket;
      if (socket) {
        socket.close();
      }
      set({ socket: null });
      console.log("Socket disconnected");
    };

    set({ socket });
  },
  socketDisconnect: () => {},

  // -------------------
  // Search
  // -------------------

  searchList: null,

  searchUsers: (query: string) => {
    if (query) {
      const socket = get().socket;
      socket?.send(
        JSON.stringify({
          source: "user.search",
          query,
        }),
      );
    } else {
      set({ searchList: null });
    }
  },

  // -------------------
  // Friends
  // -------------------

  friendList: null,

  // -------------------
  // Messages
  // -------------------

  messagesList: [],
  messagesNext: null,
  messagesTyping: null,
  messagesUsername: null,

  messageList: (connectionId: number, page: number = 0) => {
    if (page === 0) {
      set({
        messagesList: [],
        messagesNext: null,
        messagesTyping: null,
        messagesUsername: null,
      });
    } else {
      set({ messagesNext: null });
    }

    const socket = get().socket;
    socket?.send(
      JSON.stringify({
        source: "message.list",
        connectionId,
        page,
      }),
    );
  },

  messageSend: (connectionId: number, message: string) => {
    const socket = get().socket;
    socket?.send(
      JSON.stringify({
        source: "message.send",
        connectionId,
        message,
      }),
    );
  },

  messageType: (username: string) => {
    const socket = get().socket;
    socket?.send(
      JSON.stringify({
        source: "message.type",
        username,
      }),
    );
  },

  // -------------------
  // Requests
  // -------------------

  requestList: null,

  requestAccept: (username: string) => {
    const socket = get().socket;
    socket?.send(
      JSON.stringify({
        source: "request.accept",
        username,
      }),
    );
  },

  requestConnect: (username: string) => {
    const socket = get().socket;
    socket?.send(
      JSON.stringify({
        source: "request.connect",
        username,
      }),
    );
  },

  // -------------------
  // Thumbnail
  // -------------------

  uploadThumbnail: async (file: any) => {
    const socket = get().socket;
    socket?.send(
      JSON.stringify({
        source: "user.thumbnail",
        base64: file.base64,
        filename: file.fileName,
      }),
    );
  },
}));

export default useStore;
