import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Actionsheet,
  Button,
  Center,
  Divider,
  FlatList,
  Heading,
  HStack,
  Icon,
  Input,
  Pressable,
  Text,
  useColorMode,
  useDisclose,
} from "native-base";
import { VirtualKeyboard as RNVirtualKeyboard } from "react-native-screen-keyboard";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleEmoji from "simple-react-native-emoji";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import RNAndroidKeyboardAdjust from "rn-android-keyboard-adjust";
import styles from "./styles";
import Container from "../../components/container";
import BackButton from "../../components/backButton";
import colors from "../../constants/colors";
import categories from "../../constants/categories";
import { formatDate, formatToCurrency } from "../../utils";
import { StateContext } from "../../contexts";

const VirtualKeyboard = React.memo(
  RNVirtualKeyboard,
  (prevProps, nextProps) =>
    prevProps.amount === nextProps.amount &&
    prevProps.colorMode === nextProps.colorMode,
);

const keyboard = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [
    null,
    0,
    <Icon
      as={MaterialCommunityIcons}
      name="backspace-outline"
      size={25}
      _light={{ color: colors.muted[900] }}
      _dark={{ color: colors.muted[50] }}
    />,
  ],
];

const TransactionScreen = () => {
  const [amount, setAmount] = useState(0);
  const { colorMode } = useColorMode();
  const { is24Hour } = useContext(StateContext);
  const [category, setCategory] = useState(categories.home);
  const {
    isOpen: isCategoryList,
    onOpen: onOpenCategoryList,
    onClose: onCloseCategoryList,
  } = useDisclose();
  const [date, setDate] = useState(moment().toDate());
  const {
    isOpen: isDatePicker,
    onOpen: onOpenDatePicker,
    onClose: onCloseDatePicker,
  } = useDisclose();
  const [description, setDescription] = useState("");

  useEffect(() => {
    RNAndroidKeyboardAdjust.setAdjustPan();
    return () => {
      RNAndroidKeyboardAdjust.setAdjustResize();
    };
  }, []);

  const onPress = useCallback(
    (value = "") => {
      let _amount = String(amount);
      if (value === "back") {
        _amount = String(_amount).slice(0, -1);
      } else if (value !== "custom") {
        _amount = _amount + value;
      }
      if (_amount.length > 9) {
        return;
      }
      setAmount(Number(_amount));
    },
    [amount],
  );

  return (
    <Container noScroll>
      <HStack alignItems="center">
        <BackButton />
        <Heading flex={1} textAlign="center">
          Gastos
        </Heading>
        <BackButton hidden />
      </HStack>
      <Center flex={1} alignItems="center">
        <Heading fontSize="4xl">{formatToCurrency(amount)}</Heading>
      </Center>
      <HStack alignItems="flex-end" space={3}>
        <Input
          flex={1}
          autoCapitalize="sentences"
          placeholder="Añade una descripción"
          fontSize="sm"
          variant="unstyled"
          px={2}
          py={2}
          value={description}
          onChangeText={setDescription}
        />
        <Button
          size="lg"
          variant="unstyled"
          borderRadius="3xl"
          _light={{ bg: "muted.900", _text: { color: "muted.50" } }}
          _dark={{ bg: "muted.50", _text: { color: "muted.900" } }}>
          Guardar
        </Button>
      </HStack>
      <Divider />
      <HStack alignItems="center">
        <Pressable py={3} pl={2} pr={3} onPress={onOpenDatePicker}>
          <Text>{formatDate(moment(date), is24Hour)}</Text>
        </Pressable>
        <Pressable
          flex={1}
          h="full"
          py={2}
          pl={3}
          pr={2}
          onPress={onOpenCategoryList}>
          <HStack alignItems="center" space={2}>
            <SimpleEmoji
              shortName={category.categoryIcon}
              style={styles.icon}
            />
            <Text flex={1} fontSize="md" numberOfLines={1}>
              {category.categoryName}
            </Text>
            <Icon
              as={MaterialCommunityIcons}
              name="chevron-down"
              size={25}
              _light={{ color: colors.muted[900] }}
              _dark={{ color: colors.muted[50] }}
            />
          </HStack>
        </Pressable>
      </HStack>
      <Divider />
      <VirtualKeyboard
        amount={amount}
        colorMode={colorMode}
        onKeyDown={onPress}
        keyboardStyle={[
          styles.keyboard,
          {
            backgroundColor:
              colorMode === "light"
                ? colors.blueGray[50]
                : colors.blueGray[900],
          },
        ]}
        keyStyle={[
          styles.key,
          {
            backgroundColor:
              colorMode === "light"
                ? colors.blueGray[50]
                : colors.blueGray[900],
          },
        ]}
        keyTextStyle={{
          color:
            colorMode === "light" ? colors.blueGray[900] : colors.blueGray[50],
        }}
        keyboard={keyboard}
      />
      <DatePicker
        modal
        androidVariant="nativeAndroid"
        title="Seleccione una fecha y hora"
        confirmText="Confirmar"
        cancelText="Cancelar"
        open={isDatePicker}
        date={date}
        onConfirm={_date => {
          setDate(_date);
          onCloseDatePicker();
        }}
        maximumDate={new Date()}
        onCancel={onCloseDatePicker}
      />
      <Actionsheet isOpen={isCategoryList} onClose={onCloseCategoryList}>
        <Actionsheet.Content>
          <FlatList
            w="100%"
            data={Object.values(categories).sort((a, b) => a.order - b.order)}
            renderItem={({ item }) => (
              <Actionsheet.Item
                isFocused={item.id === category.id}
                _light={{
                  _pressed: { bg: colors.muted[200] },
                  _focus: { bg: colors.muted[200] },
                }}
                _dark={{
                  _pressed: { bg: colors.muted[700] },
                  _focus: { bg: colors.muted[700] },
                }}
                borderRadius="lg"
                onPress={() => {
                  setCategory(item);
                  onCloseCategoryList();
                }}>
                <HStack alignItems="center" space={2}>
                  <SimpleEmoji
                    shortName={item.categoryIcon}
                    style={styles.icon}
                  />
                  <Text fontSize="md" numberOfLines={1}>
                    {item.categoryName}
                  </Text>
                </HStack>
              </Actionsheet.Item>
            )}
            keyExtractor={item => String(item.id)}
            showsVerticalScrollIndicator={false}
          />
        </Actionsheet.Content>
      </Actionsheet>
    </Container>
  );
};

export default TransactionScreen;
