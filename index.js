/**
 * @format
 */
import "react-native-gesture-handler";
import React from "react";
import { AppRegistry } from "react-native";
import { extendTheme, NativeBaseProvider } from "native-base";
import App from "./src/App";
import { name as appName } from "./app.json";

const Root = () => {
  return (
    <NativeBaseProvider
      theme={extendTheme({ config: { useSystemColorMode: true } })}>
      <App />
    </NativeBaseProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
