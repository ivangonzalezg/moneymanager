import React, { useCallback, useContext } from "react";
import {
  AlertDialog,
  Button,
  Heading,
  HStack,
  Icon,
  Pressable,
  Switch,
  Text,
  useColorMode,
  useDisclose,
  VStack,
} from "native-base";
import Feather from "react-native-vector-icons/Feather";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Papa from "papaparse";
import RNFS from "react-native-fs";
import * as RNZA from "react-native-zip-archive";
import Share from "react-native-share";
import DocumentPicker from "react-native-document-picker";
import getPath from "@flyerhq/react-native-android-uri-path";
import Container from "../../components/container";
import colors from "../../constants/colors";
import { openUrl } from "../../utils";
import Br from "../../components/br";
import routes from "../../routes";
import constants from "../../constants";
import database from "../../database";
import { ProgressContext, StateContext } from "../../contexts";

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
  const state = useContext(StateContext);
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclose();

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
        `${RNFS.DocumentDirectoryPath}/${constants.BACKUP_FILE_NAME}`,
      );
      progress.hideProgressDialog();
      await Share.open({
        url: `file://${zipPath}`,
        type: "text/csv",
        failOnCancel: false,
      });
      await RNFS.unlink(categoriesCsvPath);
      await RNFS.unlink(transactionsCsvPath);
      await RNFS.unlink(zipPath);
      // TODO: Display some confirmation to the user
    } catch (_) {
      progress.hideProgressDialog();
    }
  };

  const onImportData = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.zip],
      });
      if (result.name !== constants.BACKUP_FILE_NAME) {
        // TODO: Display some error to the user
        return;
      }
      progress.showProgressDialog("Importando datos");
      const folderPath = `${
        RNFS.DocumentDirectoryPath
      }/${constants.BACKUP_FILE_NAME.split(".").shift()}`;
      await RNZA.unzip(getPath(result.uri), folderPath);
      const files = await RNFS.readDir(folderPath);
      await database.deleteAllCategories();
      await database.deleteAllTransactions();
      await Promise.all(
        files.map(async file => {
          const table = file.name.split(".").shift();
          const content = await RNFS.readFile(file.path, "utf8");
          const { data } = Papa.parse(content, { header: true });
          if (table === constants.tables.CATEGORIES) {
            await database.createCategories(data);
            const [category] = data;
            await AsyncStorage.setItem(
              constants.storage.LAST_CATEGORY,
              JSON.stringify(category),
            );
            state.updateCategory(category);
          }
          if (table === constants.tables.TRANSACTIONS) {
            await database.createTransactions(data);
          }
        }),
      );
      await RNFS.unlink(folderPath);
      state.updateCategories();
      state.updateTransactions();
      progress.hideProgressDialog();
    } catch (_) {
      progress.hideProgressDialog();
    }
  };

  const onDeleteData = async () => {
    try {
      onDeleteModalClose();
      progress.showProgressDialog("Borrando datos");
      await database.deleteAllCategories();
      await database.deleteAllTransactions();
      await database.createCategories();
      const [category] = await database.getCategories();
      await AsyncStorage.setItem(
        constants.storage.LAST_CATEGORY,
        JSON.stringify(category),
      );
      state.updateCategory(category);
      state.updateCategories();
      state.updateTransactions();
      progress.hideProgressDialog();
      // TODO: Display some confirmation to the user
    } catch (_) {
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
      <ButtonItem label="Importar datos" icon="upload" onPress={onImportData} />
      <Br size={1} />
      <ButtonItem
        borderBottomRadius
        label="Borrar datos"
        icon="file-minus"
        onPress={onDeleteModalOpen}
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
          Versión {DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
        </Text>
        <Pressable onPress={() => openUrl("https://ivangonzalez.co")}>
          <Text fontSize="sm">Iván González</Text>
        </Pressable>
      </VStack>
      <AlertDialog
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        _backdrop={{ _pressed: { opacity: 0.3 } }}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton borderRadius="full" />
          <AlertDialog.Header>Borrar datos</AlertDialog.Header>
          <AlertDialog.Body>
            <Text>
              ¿Estás seguro que deseas borrar los datos?{" "}
              <Text bold>Está acción no se puede deshacer</Text>
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              variant="unstyled"
              flex={1}
              onPress={onDeleteData}
              _light={{ bg: "transparent", _text: { color: "muted.900" } }}
              _dark={{ bg: "transparent", _text: { color: "muted.50" } }}>
              Si
            </Button>
            <Br horizontal />
            <Button colorScheme="muted" flex={1} onPress={onDeleteModalClose}>
              No
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Container>
  );
};

export default Settings;
