import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import styles from "./styles";

const Br = props => {
  const { size, horizontal } = props;

  return (
    <View
      style={[
        styles.container,
        horizontal ? { width: size } : { height: size },
      ]}
    />
  );
};

export default React.memo(Br);

Br.propTypes = {
  size: PropTypes.number,
  horizontal: PropTypes.bool,
};

Br.defaultProps = {
  size: 20,
  horizontal: false,
};
