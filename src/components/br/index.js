import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import styles from "./styles";

export default function Br(props) {
  const { size, horizontal } = props;

  return (
    <View
      style={[
        styles.container,
        horizontal ? { width: size } : { height: size },
      ]}
    />
  );
}

Br.propTypes = {
  size: PropTypes.number,
  horizontal: PropTypes.bool,
};

Br.defaultProps = {
  size: 20,
  horizontal: false,
};
