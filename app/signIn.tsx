import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Link, useRouter } from "expo-router";
import api from "@/store/api";
import useStore from "@/store/store";
import secure from "@/utils/secure";
import { useAuth } from "@/context/AuthContext";

const signIn = () => {
  const { signIn } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const login = useStore((state) => state.login);

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

    // Make API request
    signIn(username, password);
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
