import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { Heading, HStack, Radio, useColorMode } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Container from "../../components/container";
import BackButton from "../../components/backButton";
import constants from "../../constants";

const Appearance = () => {
  const [isAutomatic, setIsAutomatic] = useState(false);
  const { colorMode, setColorMode } = useColorMode();
  const colorScheme = useColorScheme();

  const validateAutomatic = async () => {
    try {
      const _colorMode = await AsyncStorage.getItem(
        constants.storage.COLOR_MODE,
      );
      setIsAutomatic(!_colorMode);
    } catch (error) {}
  };

  useEffect(() => {
    validateAutomatic();
  }, []);

  const onChangeAppearance = async value => {
    if (value === "automatic") {
      await AsyncStorage.removeItem(constants.storage.COLOR_MODE);
      setColorMode(colorScheme);
    } else {
      setColorMode(value);
      await AsyncStorage.setItem(constants.storage.COLOR_MODE, value);
    }
    validateAutomatic();
  };

  return (
    <Container disableFeedback safeAreaTop safeAreaBottom>
      <HStack alignItems="center" mt={2} mb={10}>
        <BackButton />
        <Heading flex={1} textAlign="center">
          Apariencia
        </Heading>
        <BackButton hidden />
      </HStack>
      <Radio.Group
        value={isAutomatic ? "automatic" : colorMode}
        onChange={onChangeAppearance}>
        <Radio value="automatic" my="2">
          Automático
        </Radio>
        <Radio value="light" my="2">
          Claro
        </Radio>
        <Radio value="dark" my="2">
          Oscuro
        </Radio>
      </Radio.Group>
    </Container>
  );
};

export default Appearance;
