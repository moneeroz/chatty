import { Image } from "react-native";
import React from "react";
import thumbnail from "@/utils/thumbnail";

interface Props {
  url: string | null;
  size: number;
}

const Thumbnail = ({ url, size }: Props) => {
  return (
    <Image
      source={thumbnail(url)}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#e0e0e0",
      }}
    />
  );
};

export default Thumbnail;
