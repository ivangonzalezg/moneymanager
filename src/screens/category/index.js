import React, { useContext, useRef, useState } from "react";
import {
  Alert,
  Button,
  Heading,
  HStack,
  Input,
  Pressable,
  Text,
  VStack,
} from "native-base";
import emoji from "emoji-dictionary";
import emojiData from "emoji-datasource";
import Container from "../../components/container";
import BackButton from "../../components/backButton";
import Emoji from "../../components/emoji";
import database from "../../database";
import { StateContext } from "../../contexts";

const Category = props => {
  const {
    navigation,
    route: { params },
  } = props;
  const iconInput = useRef();
  const state = useContext(StateContext);
  const [name, setName] = useState(params.name || "");
  const [icon, setIcon] = useState(params.icon || "money_mouth_face");
  const [isIconError, setIsIconError] = useState(false);
  const [isIconFocused, setIsIconFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onChangeIcon = text => {
    const _icon = emoji.getName(text);
    const isIcon = emojiData.find(_emoji => _emoji.short_name === _icon);
    setIsIconError(!isIcon);
    setIcon(isIcon && _icon ? _icon : "");
  };

  const onSave = async () => {
    try {
      setIsSaving(true);
      const data = {
        name,
        icon,
      };
      if (params.id) {
        await database.updateCategory(params.id, data);
      } else {
        data.position = params.position;
        await database.createCategory(data);
      }
      state.updateCategories();
      navigation.goBack();
    } catch (_) {}
  };

  return (
    <Container
      disableFeedback
      disableKeyboardAvoiding
      safeAreaTop
      safeAreaBottom>
      <HStack alignItems="center" mt={2} mb={10}>
        <BackButton />
        <Heading flex={1} textAlign="center">
          {params.id ? "Editar" : "Nueva"} categoría
        </Heading>
        <BackButton hidden />
      </HStack>
      <VStack space={5} alignItems="center">
        <Pressable
          p={3}
          borderWidth={1}
          borderRadius="lg"
          w={100}
          h={100}
          justifyContent="center"
          alignItems="center"
          onPress={() => iconInput.current.focus()}
          _light={{ borderColor: isIconFocused ? "muted.500" : "muted.300" }}
          _dark={{ borderColor: isIconFocused ? "muted.400" : "muted.600" }}>
          <Input
            ref={iconInput}
            position="absolute"
            w={0}
            variant="unstyled"
            fontSize="xs"
            size="xs"
            value=""
            onChangeText={onChangeIcon}
            onFocus={() => setIsIconFocused(true)}
            onBlur={() => setIsIconFocused(false)}
          />
          <Emoji shortName={icon} fontSize="5xl" />
        </Pressable>
        {isIconError && (
          <Alert status="error">
            <VStack space={2} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} justifyContent="space-between">
                <HStack space={2} flexShrink={1}>
                  <Alert.Icon mt="1" />
                  <Text fontSize="md" color="coolGray.800">
                    Emoji no disponible
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Alert>
        )}
        <Input
          autoCapitalize="sentences"
          placeholder="Nombre"
          fontSize="xl"
          variant="unstyled"
          returnKeyType="done"
          textAlign="center"
          value={name}
          onChangeText={setName}
          _focus={{
            _light: { borderBottomColor: "muted.500" },
            _dark: { borderBottomColor: "muted.400" },
          }}
        />
        <Button
          w="full"
          onPress={onSave}
          disabled={isIconError || !name || isSaving}>
          Guardar
        </Button>
      </VStack>
    </Container>
  );
};

export default Category;
