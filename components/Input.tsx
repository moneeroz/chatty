import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";

interface Props {
  title: string;
  isPassword?: boolean;
  value: string;
  setValue: (text: string) => void;
  error: string;
  setError: (text: string) => void;
}

const Input = ({
  title,
  isPassword = false,
  value,
  setValue,
  error,
  setError,
}: Props) => {
  return (
    <View>
      <Text
        style={[
          styles.title,
          {
            color: error ? "#ff5555" : "#70747a",
          },
        ]}
      >
        {error ? error : title}
      </Text>
      <TextInput
        autoComplete="off"
        autoCapitalize="none"
        secureTextEntry={isPassword}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          if (error) {
            setError("");
          }
        }}
        style={[
          styles.textInput,
          { borderColor: error ? "#ff5555" : "transparent" },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginVertical: 6,
    paddingLeft: 16,
  },
  textInput: {
    backgroundColor: "#e1e2e4",
    height: 52,
    borderWidth: 1,
    borderRadius: 26,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

export default Input;
