import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Platform } from "react-native";
import {
  Actionsheet,
  Button,
  Center,
  Divider,
  FlatList,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Pressable,
  Text,
  useDisclose,
} from "native-base";
import Feather from "react-native-vector-icons/Feather";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import RNAndroidKeyboardAdjust from "rn-android-keyboard-adjust";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Container from "../../components/container";
import BackButton from "../../components/backButton";
import colors from "../../constants/colors";
import { formatDate, formatToCurrency, getCategory } from "../../utils";
import database from "../../database";
import { StateContext } from "../../contexts";
import constants from "../../constants";
import Emoji from "../../components/emoji";
import { useKeyboardHeight } from "../../hooks";
import VirtualKeyboard from "../../components/virtualKeyboard";

const virtualKeyboardHeight = Dimensions.get("screen").height * 0.325;

const TransactionScreen = props => {
  const {
    navigation,
    route: { params },
  } = props;
  const descriptionInput = useRef();
  const keyboardHeight = useKeyboardHeight();
  const insets = useSafeAreaInsets();
  const state = useContext(StateContext);
  const [amount, setAmount] = useState(params.amount || 0);
  const [category, setCategory] = useState(
    getCategory(params?.category_id, state.categories) || state.category,
  );
  const {
    isOpen: isCategoryList,
    onOpen: onOpenCategoryList,
    onClose: onCloseCategoryList,
  } = useDisclose();
  const [date, setDate] = useState(
    moment(params.date)
      .startOf(!params.date && "hour")
      .toDate(),
  );
  const {
    isOpen: isDatePicker,
    onOpen: onOpenDatePicker,
    onClose: onCloseDatePicker,
  } = useDisclose();
  const [description, setDescription] = useState(params.description || "");
  const [isSaving, setIsSaving] = useState(false);
  const [animatedHeight] = useState(new Animated.Value(0));
  const [isIncome, setIsIncome] = useState(Boolean(params.is_income));
  const {
    isOpen: isTypeList,
    onOpen: onOpenTypeList,
    onClose: onCloseTypeList,
  } = useDisclose();

  useEffect(() => {
    RNAndroidKeyboardAdjust.setAdjustPan();
    return () => {
      RNAndroidKeyboardAdjust.setAdjustResize();
    };
  }, []);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue:
        virtualKeyboardHeight < keyboardHeight
          ? Platform.select({
              android: 60,
              default:
                keyboardHeight - virtualKeyboardHeight - insets.bottom + 12,
            })
          : 0,
      useNativeDriver: false,
      duration: 300,
    }).start();
  }, [keyboardHeight, insets]);

  useEffect(() => {
    if (
      (isCategoryList || isDatePicker) &&
      descriptionInput.current.isFocused()
    ) {
      descriptionInput.current.blur();
    }
  }, [isCategoryList, isDatePicker]);

  const onSave = async () => {
    try {
      setIsSaving(true);
      const data = {
        amount,
        category_id: category.id,
        date: date.toISOString(),
        description,
        is_income: Number(isIncome),
      };
      if (params.id) {
        await database.updateTransaction(params.id, data);
      } else {
        await database.createTransaction(data);
      }
      await AsyncStorage.setItem(
        constants.storage.LAST_CATEGORY,
        JSON.stringify(category),
      );
      state.updateCategory(category);
      state.updateTransactions();
      navigation.goBack();
    } catch (_) {}
  };

  const onDelete = async () => {
    try {
      await database.deleteTransaction(params.id);
      state.updateTransactions();
      navigation.goBack();
    } catch (_) {}
  };

  return (
    <Container noScroll disableKeyboardAvoiding safeAreaTop safeAreaBottom>
      <HStack alignItems="center">
        <BackButton />
        <Pressable flex={1} onPress={onOpenTypeList}>
          <HStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            space={1}>
            <Heading>{isIncome ? "Ingreso" : "Gasto"}</Heading>
            <Icon as={Feather} name="chevron-down" size="lg" />
          </HStack>
        </Pressable>
        {params.id ? (
          <IconButton
            py={1}
            pl={1}
            pr={0}
            variant="unstyled"
            icon={<Icon as={Feather} name="trash" size="lg" />}
            onPress={onDelete}
          />
        ) : (
          <BackButton hidden />
        )}
      </HStack>
      <Center flex={1} alignItems="center">
        <Heading fontSize="4xl">{formatToCurrency(amount)}</Heading>
      </Center>
      <HStack alignItems="flex-end" space={3}>
        <Input
          ref={descriptionInput}
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
        <Button disabled={!amount || isSaving} onPress={onSave}>
          Guardar
        </Button>
      </HStack>
      <Divider />
      <HStack alignItems="center">
        <Pressable py={3} pl={2} pr={3} onPress={onOpenDatePicker}>
          <Text>{formatDate(moment(date))}</Text>
        </Pressable>
        <Pressable
          flex={1}
          h="full"
          py={2}
          pl={3}
          pr={2}
          onPress={onOpenCategoryList}>
          <HStack alignItems="center" space={2}>
            <Emoji shortName={category.icon} fontSize="xl" />
            <Text flex={1} numberOfLines={1}>
              {category.name}
            </Text>
            <Icon as={Feather} name="chevron-down" size={25} />
          </HStack>
        </Pressable>
      </HStack>
      <Divider />
      <Animated.View
        style={{
          height: animatedHeight,
        }}
      />
      <VirtualKeyboard height={virtualKeyboardHeight} onPress={setAmount} />
      <DatePicker
        modal
        androidVariant="nativeAndroid"
        title="Seleccione una fecha y hora"
        confirmText="Confirmar"
        cancelText="Cancelar"
        minuteInterval={5}
        open={isDatePicker}
        date={date}
        onConfirm={_date => {
          setDate(_date);
          onCloseDatePicker();
        }}
        maximumDate={new Date()}
        onCancel={onCloseDatePicker}
      />
      <Actionsheet
        isOpen={isCategoryList}
        onClose={onCloseCategoryList}
        _backdrop={{ _pressed: { opacity: 0.3 } }}>
        <Actionsheet.Content>
          <FlatList
            w="100%"
            data={state.categories}
            renderItem={({ item }) => (
              <Actionsheet.Item
                isFocused={Number(item.id) === Number(category.id)}
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
                  <Emoji shortName={item.icon} fontSize="xl" />
                  <Text numberOfLines={1}>{item.name}</Text>
                </HStack>
              </Actionsheet.Item>
            )}
            keyExtractor={item => String(item.id)}
            showsVerticalScrollIndicator={false}
          />
        </Actionsheet.Content>
      </Actionsheet>
      <Actionsheet
        isOpen={isTypeList}
        onClose={onCloseTypeList}
        _backdrop={{ _pressed: { opacity: 0.3 } }}>
        <Actionsheet.Content>
          <FlatList
            w="100%"
            data={[
              { label: "Gasto", value: false },
              { label: "Ingreso", value: true },
            ]}
            renderItem={({ item }) => (
              <Actionsheet.Item
                isFocused={isIncome === item.value}
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
                  setIsIncome(item.value);
                  onCloseTypeList();
                }}>
                {item.label}
              </Actionsheet.Item>
            )}
            keyExtractor={item => item.label.toLowerCase()}
            showsVerticalScrollIndicator={false}
          />
        </Actionsheet.Content>
      </Actionsheet>
    </Container>
  );
};

export default TransactionScreen;
