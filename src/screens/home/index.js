import React, { useCallback, useContext, useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import {
  Box,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Pressable,
  SectionList,
  Text,
  VStack,
} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./styles";
import Container from "../../components/container";
import colors from "../../constants/colors";
import {
  formatToCurrency,
  transformTransactionsIntoSections,
  populatingTransactions,
} from "../../utils";
import routes from "../../routes";
import { StateContext } from "../../contexts";
import database from "../../database";
import TransactionCard from "../../components/transactionCard";

const HomeScreen = props => {
  const { navigation } = props;
  const state = useContext(StateContext);
  const [monthExpenses, setMonthExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [sections, setSections] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [query, setQuery] = useState("");

  const getTransactions = async () => {
    try {
      setIsRefreshing(true);
      const _monthExpenses = await database.getMonthExpenses();
      setMonthExpenses(_monthExpenses);
      let _transactions = await database.getTransactions();
      _transactions = populatingTransactions(_transactions);
      setTransactions(_transactions);
      setSections(transformTransactionsIntoSections(_transactions));
    } catch (_) {}
    setIsRefreshing(false);
  };

  useEffect(() => {
    getTransactions();
  }, [state.transactions]);

  const filterTransactions = useCallback(
    (_query = "") => {
      setSections(
        transformTransactionsIntoSections(
          _query
            ? transactions.filter(
                transaction =>
                  (Number.isInteger(Number(_query)) &&
                    transaction.amount === Number(_query)) ||
                  transaction.category.name
                    .toLowerCase()
                    .includes(_query.toLowerCase()) ||
                  transaction.description
                    .toLowerCase()
                    .includes(_query.toLowerCase()),
              )
            : transactions,
        ),
      );
    },
    [transactions],
  );

  return (
    <Container noScroll disableFeedback>
      <HStack
        _android={{ mt: 3 }}
        _ios={{ mt: 1 }}
        justifyContent="space-between"
        alignItems="center"
        space={5}>
        <Input
          autoCapitalize="sentences"
          placeholder="Busca movimientos"
          fontSize="sm"
          variant="unstyled"
          returnKeyType="search"
          flex={1}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => filterTransactions(query)}
          InputLeftElement={
            <Icon
              as={MaterialCommunityIcons}
              name="magnify"
              my={2}
              ml={2}
              size={6}
              _dark={{ color: "gray.200" }}
              _light={{ color: "gray.600" }}
            />
          }
          InputRightElement={
            query && (
              <Pressable
                onPress={() => {
                  setQuery("");
                  filterTransactions();
                }}>
                <Icon
                  as={MaterialCommunityIcons}
                  name="close"
                  my={2}
                  mx={1}
                  size={6}
                  _dark={{ color: "gray.200" }}
                  _light={{ color: "gray.600" }}
                />
              </Pressable>
            )
          }
        />
        <VStack>
          <IconButton
            p={1}
            variant="solid"
            borderRadius="full"
            _light={{ bg: "muted.900" }}
            _dark={{ bg: "muted.100" }}
            colorScheme="muted"
            icon={
              <Icon
                as={MaterialCommunityIcons}
                name="plus"
                size="xl"
                _light={{ color: colors.muted[100] }}
                _dark={{ color: colors.muted[900] }}
              />
            }
            onPress={() => navigation.navigate(routes.transaction)}
          />
        </VStack>
      </HStack>
      <SectionList
        refreshControl={<RefreshControl refreshing={isRefreshing} />}
        ListHeaderComponent={() => (
          <Center mt={10}>
            <Text opacity={70}>Gastado este mes</Text>
            <Heading fontSize="4xl">{formatToCurrency(monthExpenses)}</Heading>
          </Center>
        )}
        sections={sections}
        renderSectionHeader={({ section }) => (
          <Box
            pt={10}
            _dark={{ bg: "blueGray.900" }}
            _light={{ bg: "blueGray.50" }}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text opacity={70}>{section.title}</Text>
              <Text opacity={70}>{formatToCurrency(section.total)}</Text>
            </HStack>
            <Divider mt={2} />
          </Box>
        )}
        renderItem={info => <TransactionCard {...info} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={sections.length === 0 && styles.contentContainer}
        ListEmptyComponent={() =>
          !isRefreshing && (
            <Center flex={1} px={5}>
              <Icon
                as={MaterialCommunityIcons}
                name="cash-remove"
                size="6xl"
                _dark={{ color: "gray.200" }}
                _light={{ color: "gray.600" }}
              />
              <Text bold fontSize="lg" textAlign="center">
                No se ha encontrado ninguna transacción
              </Text>
            </Center>
          )
        }
      />
    </Container>
  );
};

export default HomeScreen;
