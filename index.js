/**
 * @format
 */
import "react-native-gesture-handler";
import React from "react";
import { AppRegistry, Platform, StyleSheet } from "react-native";
import { extendTheme, NativeBaseProvider } from "native-base";
import "moment/locale/es";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import App from "./src/App";
import { name as appName } from "./app.json";

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

const Root = () => {
  return (
    <NativeBaseProvider
      theme={extendTheme({
        config: { useSystemColorMode: true },
        components: {
          Pressable: {
            defaultProps: {
              _pressed: { opacity: 70 },
              _disabled: { opacity: 50 },
            },
          },
          Text: {
            defaultProps: {
              fontSize: "md",
            },
          },
          Switch: {
            defaultProps: {
              size: Platform.OS === "ios" ? "sm" : "md",
            },
          },
          Button: {
            defaultProps: {
              size: "lg",
              variant: "unstyled",
              borderRadius: "full",
              _light: { bg: "muted.900", _text: { color: "muted.50" } },
              _dark: { bg: "muted.50", _text: { color: "muted.900" } },
            },
          },
        },
      })}>
      <GestureHandlerRootView style={styles.flex}>
        <App />
      </GestureHandlerRootView>
    </NativeBaseProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
