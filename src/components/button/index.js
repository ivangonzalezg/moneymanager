import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";
import { Text } from "native-base";
import styles from "./styles";

export default function Button(props) {
  const { children, disabled, style, ...rest } = props;

  return (
    <TouchableOpacity
      style={[styles.default, style]}
      activeOpacity={0.7}
      disabled={disabled}
      {...rest}>
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </TouchableOpacity>
  );
}

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.any,
};

Button.defaultProps = {
  disabled: false,
  style: {},
};
