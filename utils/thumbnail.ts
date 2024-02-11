import { ADDRESS } from "@/store/api";

const ProfileImage = require("../assets/images/user.png");

const thumbnail = (url: string | undefined | null) => {
  if (!url) {
    return ProfileImage;
  }

  console.log({ uri: "http://" + ADDRESS + url });
  return { uri: "http://" + ADDRESS + url };
};

export default thumbnail;
