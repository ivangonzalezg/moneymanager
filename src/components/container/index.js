import React from "react";
import PropTypes from "prop-types";
import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { Box, KeyboardAvoidingView } from "native-base";
import styles from "./styles";

const Container = props => {
  const {
    children,
    noScroll,
    noPadding,
    disableFeedback,
    disableKeyboardAvoiding,
    safeAreaTop,
    safeAreaBottom,
  } = props;

  const Wrapper = noScroll ? View : KeyboardAwareScrollView;

  const KeyboardAvoiding =
    disableKeyboardAvoiding || Platform.OS === "android"
      ? Box
      : KeyboardAvoidingView;

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      disabled={disableFeedback}>
      <KeyboardAvoiding flex={1} behavior="height">
        <Box
          _dark={{ bg: "blueGray.900" }}
          _light={{ bg: "blueGray.50" }}
          flex={1}
          safeAreaTop={safeAreaTop ? true : 0}
          safeAreaBottom={safeAreaBottom ? true : 0}>
          <Wrapper style={styles.wrapper} keyboardShouldPersistTaps="handled">
            <Box flex={1} px={noPadding ? 0 : 5} pb={noScroll ? 0 : 5}>
              {children}
            </Box>
          </Wrapper>
        </Box>
      </KeyboardAvoiding>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(Container);

Container.propTypes = {
  children: PropTypes.node.isRequired,
  noScroll: PropTypes.bool,
  noPadding: PropTypes.bool,
  disableFeedback: PropTypes.bool,
  disableKeyboardAvoiding: PropTypes.bool,
  safeAreaTop: PropTypes.bool,
  safeAreaBottom: PropTypes.bool,
};

Container.defaultProps = {
  noScroll: false,
  noPadding: false,
  disableFeedback: false,
  disableKeyboardAvoiding: false,
  safeAreaTop: false,
  safeAreaBottom: false,
};
