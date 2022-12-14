import React, { useContext, useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import {
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  IconButton,
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
  formatToCurrency,
  transformTransactionsIntoSections,
} from "../../utils";
import routes from "../../routes";
import { StateContext } from "../../contexts";
import database from "../../database";
import TransactionCard from "../../components/transactionCard";
import TransactionHeader from "../../components/transactionHeader";

const HomeScreen = props => {
  const { navigation } = props;
  const state = useContext(StateContext);
  const [monthBalance, setMonthBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [sections, setSections] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [offset, setOffset] = useState(0);
  const [areMoreTransactions, setAreMoreTransactions] = useState(false);

  const getTransactions = async (_offset = 0) => {
    try {
      setIsRefreshing(true);
      const _monthBalance = await database.getMonthBalance();
      setMonthBalance(_monthBalance);
      let _transactions = await database.getTransactions(_offset);
      if (offset > 0) {
        _transactions = [...transactions, ..._transactions];
      }
      setTransactions(_transactions);
      const _numberOfTransactions = await database.getNumberOfTransactions();
      setAreMoreTransactions(_numberOfTransactions > _transactions.length);
      setSections(transformTransactionsIntoSections(_transactions));
    } catch (_) {}
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (state.transactions) {
      setOffset(_offset => {
        if (_offset) {
          return 0;
        }
        getTransactions();
        return _offset;
      });
    }
  }, [state.transactions]);

  useEffect(() => {
    getTransactions(offset);
  }, [offset]);

  return (
    <Container noScroll disableFeedback safeAreaTop>
      <HStack
        _android={{ mt: 3 }}
        _ios={{ mt: 1 }}
        justifyContent="space-between"
        alignItems="center"
        space={5}>
        <Pressable flex={1} onPress={() => navigation.navigate(routes.search)}>
          <HStack alignItems="center">
            <Icon as={Feather} name="search" my={2} mx={2} size={6} />
            <Text opacity={50}>Busca movimientos</Text>
          </HStack>
        </Pressable>
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
          <Center mt={5}>
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
        renderSectionHeader={TransactionHeader}
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
        ListFooterComponent={
          areMoreTransactions && (
            <Button
              my={5}
              onPress={() => setOffset(offset + 20)}
              isLoading={isRefreshing}
              isLoadingText="Cargando...">
              Cargar más
            </Button>
          )
        }
      />
    </Container>
  );
};

export default HomeScreen;
