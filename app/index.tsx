import React from "react";
import useStore from "@/store/store";
import { Redirect } from "expo-router";

const index = () => {
  const authenticated = useStore((state) => state.authenticated);

  if (!authenticated) {
    return <Redirect href="/signIn" />;
  } else {
    return <Redirect href="/(tabs)/requests" />;
  }
};

export default index;
