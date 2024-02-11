import * as SecureStore from "expo-secure-store";

const save = async (key: string, value: any) => {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
};

const getValueFor = async (key: string) => {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return JSON.parse(result);
  } else {
    console.log("No values stored under that key.");
  }
};

const remove = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};

export default { save, getValueFor, remove };
