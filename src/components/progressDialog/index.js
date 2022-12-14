import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Keyboard, Platform, BackHandler } from "react-native";
import { Box, HStack, Spinner, Text, VStack } from "native-base";
import styles from "./styles";

const ProgressDialog = props => {
  const { visible, label } = props;

  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
    }
    if (Platform.OS === "android") {
      const backListener = BackHandler.addEventListener(
        "hardwareBackPress",
        () => visible,
      );
      return () => {
        backListener.remove();
      };
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <Box
      position="absolute"
      alignItems="center"
      justifyContent="center"
      style={styles.container}>
      <Box
        _light={{ bg: "blueGray.50" }}
        _dark={{ bg: "lightBlue.900" }}
        px={7}
        py={4}
        width="80%"
        borderRadius="md">
        <VStack space={2}>
          <Text bold fontSize="xl">
            Por favor, espere
          </Text>
          <HStack alignItems="center" space={3}>
            <Spinner
              size="lg"
              _light={{ color: "primary.900" }}
              _dark={{ color: "primary.50" }}
            />
            <Text>{label || "Cargando"}...</Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default React.memo(ProgressDialog);

ProgressDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  label: PropTypes.string,
};

ProgressDialog.defaultProps = {
  label: "",
};
