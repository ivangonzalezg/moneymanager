/**
 * @format
 */
import React from "react";
import { AppRegistry, LogBox, Platform } from "react-native";
import { extendTheme, NativeBaseProvider } from "native-base";
import PushNotification, { Importance } from "react-native-push-notification";
import "moment/locale/es";
import App from "./src/App";
import { name as appName } from "./app.json";

LogBox.ignoreLogs([
  "Warning: Failed prop type: Invalid props.keyTextStyle key `color` supplied to `VirtualKeyboard`",
]);

PushNotification.configure({
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
  },
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === "ios",
});

PushNotification.createChannel({
  channelId: "money-manager",
  channelName: "Money Manager",
  channelDescription: "Canal de notificaciones de Money Manager",
  soundName: "default",
  importance: Importance.HIGH,
  vibrate: true,
  playSound: true,
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
        },
      })}>
      <App />
    </NativeBaseProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
