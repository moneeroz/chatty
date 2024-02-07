import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Link } from "expo-router";

const signIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onSignIn = () => {
    // Validate username
    if (!username) {
      setUsernameError("Username not provided");
    }

    // Validate password
    if (!password) {
      setPasswordError("Password not provided");
    }

    // Break if there are errors
    if (usernameError || passwordError) {
      return;
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Text style={styles.title}>Sign In</Text>

          <Input
            title="Username"
            value={username}
            setValue={setUsername}
            error={usernameError}
            setError={setUsernameError}
          />
          <Input
            title="Password"
            isPassword={true}
            value={password}
            setValue={setPassword}
            error={passwordError}
            setError={setPasswordError}
          />

          <Button title="Sign In" onPress={onSignIn} />

          <Text style={styles.noAccount}>
            Don't have an account?{" "}
            <Link href="/signUp" asChild style={styles.signup}>
              <Text>Sign Up</Text>
            </Link>
          </Text>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#202020",
    textAlign: "center",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 30,
  },
  noAccount: {
    textAlign: "center",
    marginTop: 40,
  },
  signup: {
    color: "blue",
  },
});

export default signIn;
