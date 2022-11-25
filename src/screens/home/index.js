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
import Feather from "react-native-vector-icons/Feather";
import styles from "./styles";
import Container from "../../components/container";
import {
  filterTransactions,
  formatToCurrency,
  transformTransactionsIntoSections,
} from "../../utils";
import routes from "../../routes";
import { StateContext } from "../../contexts";
import database from "../../database";
import TransactionCard from "../../components/transactionCard";

const HomeScreen = props => {
  const { navigation } = props;
  const state = useContext(StateContext);
  const [monthBalance, setMonthBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [sections, setSections] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [query, setQuery] = useState("");

  const getTransactions = async () => {
    try {
      setIsRefreshing(true);
      const _monthBalance = await database.getMonthBalance();
      setMonthBalance(_monthBalance);
      const _transactions = await database.getTransactions();
      setTransactions(_transactions);
      setSections(
        transformTransactionsIntoSections(
          filterTransactions(query, _transactions),
        ),
      );
    } catch (_) {}
    setIsRefreshing(false);
  };

  useEffect(() => {
    getTransactions();
  }, [state.transactions]);

  const onfilterTransactions = useCallback(
    (_query = "") => {
      setSections(
        transformTransactionsIntoSections(
          filterTransactions(_query, transactions),
        ),
      );
    },
    [transactions],
  );

  return (
    <Container noScroll disableFeedback safeAreaTop>
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
          onSubmitEditing={() => onfilterTransactions(query)}
          InputLeftElement={
            <Icon as={Feather} name="search" my={2} ml={2} size={6} />
          }
          InputRightElement={
            query && (
              <Pressable
                onPress={() => {
                  setQuery("");
                  onfilterTransactions();
                }}>
                <Icon as={Feather} name="x" my={2} mx={1} size={6} />
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
            icon={<Icon as={Feather} name="plus" size="xl" />}
            onPress={() => navigation.navigate(routes.transaction)}
          />
        </VStack>
      </HStack>
      <SectionList
        refreshControl={<RefreshControl refreshing={isRefreshing} />}
        ListHeaderComponent={() => (
          <Center mt={10}>
            <Text fontSize="sm" opacity={70}>
              Balance de este mes
            </Text>
            <Heading
              fontSize="4xl"
              _light={monthBalance > 0 && { color: "success.600" }}
              _dark={monthBalance > 0 && { color: "success.400" }}>
              {formatToCurrency(Math.abs(monthBalance))}
            </Heading>
          </Center>
        )}
        sections={sections}
        renderSectionHeader={({ section }) => (
          <Box
            pt={10}
            _dark={{ bg: "blueGray.900" }}
            _light={{ bg: "blueGray.50" }}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="sm" opacity={70}>
                {section.title}
              </Text>
              <Text fontSize="sm" opacity={70}>
                {formatToCurrency(section.total)}
              </Text>
            </HStack>
            <Divider mt={2} />
          </Box>
        )}
        renderItem={TransactionCard}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={sections.length === 0 && styles.contentContainer}
        ListEmptyComponent={() =>
          !isRefreshing && (
            <Center flex={1} px={5}>
              <Icon as={MaterialCommunityIcons} name="cash-remove" size="6xl" />
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
