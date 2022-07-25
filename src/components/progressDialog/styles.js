import { Dimensions, Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: Platform.select({
      android: "100%",
      default: Dimensions.get("screen").width,
    }),
    height: Platform.select({
      android: "100%",
      default: Dimensions.get("screen").height,
    }),
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 9999,
  },
});

export default styles;
