import React, { useContext, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import {
  Actionsheet,
  Box,
  Center,
  Divider,
  FlatList,
  Heading,
  HStack,
  Icon,
  Pressable,
  Spinner,
  Text,
  useDisclose,
  VStack,
} from "native-base";
import randomColor from "randomcolor";
import { VictoryPie, VictoryTheme } from "victory-native";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Container from "../../components/container";
import database from "../../database";
import { StateContext } from "../../contexts";
import { capitalize, formatToCurrency } from "../../utils";
import moment from "moment";
import colors from "../../constants/colors";

const chartSize = Dimensions.get("window").width - 140;

const Charts = () => {
  const state = useContext(StateContext);
  const [expenses, setExpenses] = useState([]);
  const [month, setMonth] = useState("");
  const [months, setMonths] = useState([]);
  const {
    isOpen: isMonthsList,
    onOpen: onOpenMonthsList,
    onClose: onCloseMonthsList,
  } = useDisclose();
  const [isLoadingMonths, setIsLoadingMonths] = useState(true);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);

  const getMonths = async () => {
    try {
      let _months = await database.getMonths();
      _months = _months.map(m => m.month);
      setMonths(_months);
      setMonth(_months[0] || "");
      setIsLoadingMonths(false);
    } catch (_) {}
  };

  useEffect(() => {
    getMonths();
  }, [state.transactions]);

  const getExpenses = async () => {
    try {
      const _expenses = await database.getExpensesByCategory(
        moment(month).valueOf(),
      );
      setExpenses(
        _expenses.map(_expense => ({
          ..._expense,
          y: _expense.total,
          color: randomColor({ seed: _expense.id * 457 }),
        })),
      );
      setIsLoadingExpenses(false);
    } catch (_) {}
  };

  useEffect(() => {
    if (month) {
      getExpenses();
    }
  }, [state.transactions, month]);

  const total = expenses.reduce(
    (previousValue, currentValue) => previousValue + currentValue.total,
    0,
  );

  if (isLoadingMonths || (Boolean(month) && isLoadingExpenses)) {
    return (
      <Container safeAreaTop disableFeedback noScroll>
        <Center flex={1}>
          <Spinner
            size="lg"
            _light={{ color: "primary.900" }}
            _dark={{ color: "primary.50" }}
          />
        </Center>
      </Container>
    );
  }

  if (total === 0) {
    return (
      <Container safeAreaTop disableFeedback noScroll>
        <Center flex={1}>
          <Icon as={MaterialCommunityIcons} name="cash-remove" size="6xl" />
          <Text bold fontSize="lg" textAlign="center">
            No se ha encontrado ninguna transacción
          </Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container safeAreaTop disableFeedback>
      <Heading textAlign="center" mt={2}>
        Gastos
      </Heading>
      <Pressable flex={1} my={3} onPress={onOpenMonthsList}>
        <HStack flex={1} alignItems="center" justifyContent="center" space={1}>
          <Text fontSize="xl">{capitalize(moment(month).format("MMMM"))}</Text>
          <Icon as={Feather} name="chevron-down" size="lg" />
        </HStack>
      </Pressable>
      <Center>
        <VictoryPie
          width={chartSize}
          height={chartSize}
          padding={5}
          theme={VictoryTheme.material}
          data={expenses}
          labels={[]}
          colorScale={expenses.map(expense => expense.color)}
        />
      </Center>
      <VStack mt={5} space={3}>
        {expenses.map(expense => (
          <HStack key={expense.id} alignItems="center">
            <Box bg={expense.color} borderRadius="full" h={5} w={5} mr={2} />
            <Text bold>{Math.round((expense.total * 100) / total) || 1}% </Text>
            <Text flex={1} numberOfLines={1}>
              {expense.name}
            </Text>
            <Text>{formatToCurrency(expense.total)}</Text>
          </HStack>
        ))}
      </VStack>
      <Divider my={3} />
      <HStack justifyContent="space-between">
        <Text>Total</Text>
        <Text bold>{formatToCurrency(total)}</Text>
      </HStack>
      <Actionsheet
        isOpen={isMonthsList}
        onClose={onCloseMonthsList}
        _backdrop={{ _pressed: { opacity: 0.3 } }}>
        <Actionsheet.Content>
          <FlatList
            w="100%"
            data={months}
            renderItem={({ item }) => (
              <Actionsheet.Item
                isFocused={item === month}
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
                  setMonth(item);
                  onCloseMonthsList();
                }}>
                {item}
              </Actionsheet.Item>
            )}
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
          />
        </Actionsheet.Content>
      </Actionsheet>
    </Container>
  );
};

export default Charts;
