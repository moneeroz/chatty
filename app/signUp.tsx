import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { Stack, useNavigation, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Input from "@/components/Input";
import Button from "@/components/Button";
import api from "@/store/api";
import useStore from "@/store/store";

const signUp = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const login = useStore((state) => state.login);

  const navigation = useNavigation();
  const router = useRouter();

  const onSignUp = () => {
    // Validate username
    if (!username || username.length < 4) {
      setUsernameError("Username must be at least 4 characters long");
    }

    // Validate first name
    if (!firstName) {
      setFirstNameError("First name not provided");
    }

    // Validate last name
    if (!lastName) {
      setLastNameError("Last name not provided");
    }

    // Validate password
    if (!password || password.length < 8) {
      setPasswordError("Password is too short");
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password not provided");
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    }

    // Break if there are errors
    if (
      usernameError ||
      firstNameError ||
      lastNameError ||
      passwordError ||
      confirmPasswordError
    ) {
      return;
    }

    // Make API request
    api({
      method: "POST",
      url: "/chat/signup/",
      data: {
        username,
        first_name: firstName,
        last_name: lastName,
        password,
      },
    })
      .then((res) => {
        console.log(res.data);
        login(res.data);
        router.push("/(tabs)/requests");
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log("Error", err.message);
        }
      });
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome name="chevron-left" size={18} color={"#70747a"} />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <Text style={styles.title}>Sign Up</Text>

            <Input
              title="Username"
              value={username}
              setValue={setUsername}
              error={usernameError}
              setError={setUsernameError}
            />
            <Input
              title="First Name"
              value={firstName}
              setValue={setFirstName}
              error={firstNameError}
              setError={setFirstNameError}
            />
            <Input
              title="Last Name"
              value={lastName}
              setValue={setLastName}
              error={lastNameError}
              setError={setLastNameError}
            />
            <Input
              title="Password"
              isPassword={true}
              value={password}
              setValue={setPassword}
              error={passwordError}
              setError={setPasswordError}
            />
            <Input
              title="Confirm Password"
              isPassword={true}
              value={confirmPassword}
              setValue={setConfirmPassword}
              error={confirmPasswordError}
              setError={setConfirmPasswordError}
            />

            <Button title="Sign Up" onPress={onSignUp} />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    color: "#202020",
    textAlign: "center",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default signUp;
