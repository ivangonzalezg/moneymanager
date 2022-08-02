import React from "react";
import {
  Heading,
  HStack,
  Icon,
  Pressable,
  Switch,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import Feather from "react-native-vector-icons/Feather";
import DeviceInfo from "react-native-device-info";
import PushNotification from "react-native-push-notification";
import Container from "../../components/container";
import colors from "../../constants/colors";
import { openUrl } from "../../utils";
import Br from "../../components/br";

const ButtonItem = React.memo(props => {
  const { label, icon, onPress, borderTopRadius, borderBottomRadius } = props;

  return (
    <Pressable
      px={3}
      borderTopRadius={borderTopRadius ? "xl" : "none"}
      borderBottomRadius={borderBottomRadius ? "xl" : "none"}
      onPress={onPress}
      _light={{ bg: colors.blueGray[200] }}
      _dark={{ bg: colors.blueGray[800] }}>
      <HStack space={5} minH="60px" alignItems="center">
        <Icon as={Feather} name={icon} size="lg" />
        <Text flex={1}>{label}</Text>
        <Icon as={Feather} name="chevron-right" size="lg" />
      </HStack>
    </Pressable>
  );
});

const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container safeAreaTop disableFeedback>
      <Heading textAlign="center" mt={2} mb={10}>
        Ajustes
      </Heading>
      <HStack
        space={5}
        alignItems="center"
        px={3}
        minH="60px"
        borderTopRadius="xl"
        _light={{ bg: colors.blueGray[200] }}
        _dark={{ bg: colors.blueGray[800] }}>
        <Icon as={Feather} name="moon" size="lg" />
        <Text flex={1}>Modo oscuro</Text>
        <Switch
          colorScheme="blueGray"
          isChecked={colorMode === "dark"}
          onToggle={toggleColorMode}
        />
      </HStack>
      <Br size={1} />
      <ButtonItem
        borderBottomRadius
        label="Notificaciones"
        icon="bell"
        onPress={() =>
          PushNotification.localNotificationSchedule({
            channelId: "money-manager",
            title: "Test",
            message: new Date().toISOString(),
            date: new Date(Date.now() + 30 * 1000),
          })
        }
      />
      <Br />
      <ButtonItem
        borderTopRadius
        borderBottomRadius
        label="Categorías"
        icon="list"
        onPress={() => {}}
      />
      <Br />
      <ButtonItem
        borderTopRadius
        label="Exportar datos"
        icon="download"
        onPress={() => {}}
      />
      <Br size={1} />
      <ButtonItem label="Importar datos" icon="upload" onPress={() => {}} />
      <Br size={1} />
      <ButtonItem
        borderBottomRadius
        label="Borrar datos"
        icon="file-minus"
        onPress={() => {}}
      />
      <Br />
      <ButtonItem
        borderTopRadius
        borderBottomRadius
        label="Contactar con soporte"
        icon="mail"
        onPress={() =>
          openUrl(
            `mailto:contacto@ivangonzalez.co?subject=${DeviceInfo.getApplicationName()} - ${DeviceInfo.getSystemName()} ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`,
          )
        }
      />
      <VStack alignItems="center" mt={5} space={1}>
        <Text fontSize="sm" opacity={70}>
          Version {DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
        </Text>
        <Pressable onPress={() => openUrl("https://ivangonzalez.co")}>
          <Text fontSize="sm">Ivan Gonzalez</Text>
        </Pressable>
      </VStack>
    </Container>
  );
};

export default Settings;
