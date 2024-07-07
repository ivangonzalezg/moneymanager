import React, { useContext, useRef, useState } from "react";
import { Button, Heading, HStack, Input, VStack } from "native-base";
import Container from "../../components/container";
import BackButton from "../../components/backButton";
import database from "../../database";
import { StateContext } from "../../contexts";
import { selectContactPhone } from "react-native-select-contact";
import { PermissionsAndroid, Platform } from "react-native";
import { handleError } from "../../utils";

const Client = props => {
  const {
    navigation,
    route: { params },
  } = props;
  const phoneInput = useRef();
  const state = useContext(StateContext);
  const [name, setName] = useState(params?.name || "");
  const [phone, setPhone] = useState(params?.phone || "");
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    try {
      setIsSaving(true);
      const data = {
        name,
        phone,
      };
      if (params?.id) {
        await database.updateClient(params.id, data);
      } else {
        await database.createClient(data);
      }
      state.updateClients();
      navigation.goBack();
    } catch (_) {}
  };

  const onSelectContact = async () => {
    try {
      if (Platform.OS === "android") {
        const request = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        );
        if (
          request === PermissionsAndroid.RESULTS.DENIED ||
          request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          throw Error("Permission Denied");
        }
      }
      const selection = await selectContactPhone();
      if (selection) {
        const { contact, selectedPhone } = selection;
        setName(contact.name);
        setPhone(selectedPhone.number.replace(/\D/g, ""));
      }
    } catch (error) {
      handleError(error);
    }
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
          {params?.id ? "Editar" : "Nuevo"} cliente
        </Heading>
        <BackButton hidden />
      </HStack>
      <VStack space={5} alignItems="center">
        <Input
          autoFocus
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
          onSubmitEditing={() => phoneInput.current.focus()}
        />
        <Input
          autoCapitalize="sentences"
          placeholder="Teléfono"
          fontSize="xl"
          variant="unstyled"
          returnKeyType="done"
          textAlign="center"
          keyboardType="number-pad"
          value={phone}
          onChangeText={setPhone}
          _focus={{
            _light: { borderBottomColor: "muted.500" },
            _dark: { borderBottomColor: "muted.400" },
          }}
          onSubmitEditing={onSave}
          ref={phoneInput}
        />
        <Button w="full" onPress={onSelectContact}>
          Escoger de contactos
        </Button>
        <Button w="full" onPress={onSave} disabled={!name || isSaving}>
          Guardar
        </Button>
      </VStack>
    </Container>
  );
};

export default Client;
