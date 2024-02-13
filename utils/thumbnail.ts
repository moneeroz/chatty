import { ADDRESS } from "@/store/api";

const ProfileImage = require("../assets/images/user.png");

const thumbnail = (url: string | undefined | null) => {
  if (!url) {
    return ProfileImage;
  }

  return { uri: "http://" + ADDRESS + url };
};

export default thumbnail;
