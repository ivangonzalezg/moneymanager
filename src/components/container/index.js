import React from "react";
import PropTypes from "prop-types";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { Box } from "native-base";
import styles from "./styles";

const Container = props => {
  const { children, noScroll, noPadding } = props;

  const Wrapper = noScroll ? View : KeyboardAwareScrollView;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Wrapper style={styles.wrapper} keyboardShouldPersistTaps="handled">
        <Box flex={1} px={noPadding ? 0 : 5} _android={{ pb: 3 }}>
          {children}
        </Box>
      </Wrapper>
    </TouchableWithoutFeedback>
  );
};

export default Container;

Container.propTypes = {
  children: PropTypes.node.isRequired,
  noScroll: PropTypes.bool,
  noPadding: PropTypes.bool,
};

Container.defaultProps = {
  noScroll: false,
  noPadding: false,
};
