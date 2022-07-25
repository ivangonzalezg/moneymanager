import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
  },
  keyboard: {
    height: Dimensions.get("screen").height * 0.325,
  },
  key: {
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
});

export default styles;
