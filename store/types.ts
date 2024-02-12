export interface User {
  id: number;
  name: string;
  username: string;
  thumbnail: string | null;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface GenaricUser {
  id: number;
  name: string;
  username: string;
  thumbnail: string | null;
}

export interface SearchUser {
  id: number;
  name: string;
  username: string;
  status: string;
  thumbnail: string | null;
}

export interface RequestListItem {
  id: number;
  sender: GenaricUser;
  receiver: GenaricUser;
  username: string;
  created: string;
  updated: string;
}

export interface FriendListItem {
  id: number;
  friend: GenaricUser;
  preview: string;
  updated: string;
}

export interface MessageListItem {
  id: number;
  is_me: boolean;
  text: string;
  created: string;
}
