import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import useStore from "@/store/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import thumbnail from "@/utils/thumbnail";

const ProfileImage = () => {
  const uploadThumbnail = useStore((state) => state.uploadThumbnail);
  const user = useStore((state) => state.user);
  const [image, setImage] = useState<string | null>(null);
  // console.log(image);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      base64: true,
      aspect: [16, 10],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    let path = result.assets[0].uri;
    if (Platform.OS === "ios") {
      path = "~" + path.substring(path.indexOf("/Documents"));
    }
    if (!result.assets[0].fileName)
      result.assets[0].fileName = path.split("/").pop();

    console.log(result);
    uploadThumbnail(result.assets[0]);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity style={{ marginBottom: 20 }} onPress={pickImage}>
      <Image source={thumbnail(user?.thumbnail)} style={styles.image} />
      <View style={styles.edit}>
        <FontAwesome name="pencil" size={15} color="#d0d0d0" />
      </View>
    </TouchableOpacity>
  );
};

const Signout = () => {
  const logout = useStore((state) => state.logout);

  return (
    <TouchableOpacity style={styles.signout} onPress={logout}>
      <FontAwesome name="sign-out" size={20} color="#d0d0d0" />
      <Text style={styles.signoutText}>Logout</Text>
    </TouchableOpacity>
  );
};

const profile = () => {
  const user = useStore((state) => state.user);
  console.log("hi", user);

  return (
    <View style={styles.container}>
      <ProfileImage />

      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.username}>@{user?.username}</Text>

      <Signout />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 90,
    backgroundColor: "#e0e0e0",
  },
  name: {
    marginBottom: 6,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#303030",
  },
  username: {
    textAlign: "center",
    fontSize: 14,
    color: "#303030",
  },
  signout: {
    flexDirection: "row",
    gap: 10,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
    backgroundColor: "#202020",
    marginTop: 40,
  },
  signoutText: {
    fontWeight: "bold",
    color: "#d0d0d0",
  },
  edit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202020",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
});

export default profile;
