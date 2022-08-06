import React, { useCallback, useContext } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Papa from "papaparse";
import RNFS from "react-native-fs";
import * as RNZA from "react-native-zip-archive";
import Share from "react-native-share";
import Container from "../../components/container";
import colors from "../../constants/colors";
import { openUrl } from "../../utils";
import Br from "../../components/br";
import routes from "../../routes";
import constants from "../../constants";
import database from "../../database";
import { ProgressContext } from "../../contexts";

const ButtonItem = React.memo(props => {
  const {
    label,
    icon,
    onPress,
    borderTopRadius,
    borderBottomRadius,
    disabled,
  } = props;

  return (
    <Pressable
      px={3}
      borderTopRadius={borderTopRadius ? "xl" : "none"}
      borderBottomRadius={borderBottomRadius ? "xl" : "none"}
      onPress={onPress}
      disabled={disabled}
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

const Settings = props => {
  const { navigation } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const progress = useContext(ProgressContext);

  const onToggleColorMode = useCallback(() => {
    AsyncStorage.setItem(
      constants.storage.COLOR_MODE,
      colorMode === "light" ? "dark" : "light",
    );
    toggleColorMode();
  }, [colorMode, toggleColorMode]);

  const onExportData = async () => {
    try {
      progress.showProgressDialog("Exportando datos");
      const categories = await database.getAllTableData(
        constants.tables.CATEGORIES,
      );
      const transactions = await database.getAllTableData(
        constants.tables.TRANSACTIONS,
      );
      const categoriesCsv = Papa.unparse(categories);
      const transactionsCsv = Papa.unparse(transactions);
      const categoriesCsvPath = `${RNFS.DocumentDirectoryPath}/${constants.tables.CATEGORIES}.csv`;
      const transactionsCsvPath = `${RNFS.DocumentDirectoryPath}/${constants.tables.TRANSACTIONS}.csv`;
      await RNFS.writeFile(categoriesCsvPath, categoriesCsv, "utf8");
      await RNFS.writeFile(transactionsCsvPath, transactionsCsv, "utf8");
      const zipPath = await RNZA.zip(
        [categoriesCsvPath, transactionsCsvPath],
        `${RNFS.DocumentDirectoryPath}/moneymanager.zip`,
      );
      progress.hideProgressDialog();
      await Share.open({
        message: "Share message",
        title: "Share title",
        url: `file://${zipPath}`,
        type: "text/csv",
        failOnCancel: false,
      });
      await RNFS.unlink(categoriesCsvPath);
      await RNFS.unlink(transactionsCsvPath);
      await RNFS.unlink(zipPath);
    } catch (error) {
      console.log(error);
      progress.hideProgressDialog();
    }
  };

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
          onToggle={onToggleColorMode}
        />
      </HStack>
      <Br size={1} />
      <ButtonItem
        borderBottomRadius
        label="Notificaciones"
        icon="bell"
        onPress={() => {}}
        disabled
      />
      <Br />
      <ButtonItem
        borderTopRadius
        borderBottomRadius
        label="Categorías"
        icon="list"
        onPress={() => navigation.navigate(routes.categories)}
      />
      <Br />
      <ButtonItem
        borderTopRadius
        label="Exportar datos"
        icon="download"
        onPress={onExportData}
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
