import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

interface Props {
  title: string;
  onPress: () => void;
}

const Button = ({ title, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#202020",
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Button;
