import React, { useEffect, useState } from "react";
import {
  Button,
  Center,
  HStack,
  Icon,
  Input,
  Pressable,
  SectionList,
  Text,
} from "native-base";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./styles";
import Container from "../../components/container";
import database from "../../database";
import { transformTransactionsIntoSections } from "../../utils";
import { RefreshControl } from "react-native";
import TransactionHeader from "../../components/transactionHeader";
import TransactionCard from "../../components/transactionCard";
import BackButton from "../../components/backButton";

const Search = () => {
  const [query, setQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [sections, setSections] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [areMoreTransactions, setAreMoreTransactions] = useState(false);

  const getTransactions = async (_offset = 0, _query = "") => {
    setIsRefreshing(true);
    try {
      let _transactions = await database.getTransactions(_offset, _query);
      if (offset > 0) {
        _transactions = [...transactions, ..._transactions];
      }
      setTransactions(_transactions);
      const _numberOfTransactions = await database.getNumberOfTransactions(
        _query,
      );
      setOffset(0);
      setAreMoreTransactions(_numberOfTransactions > _transactions.length);
      setSections(transformTransactionsIntoSections(_transactions));
    } catch (_) {}
    setIsRefreshing(false);
  };

  useEffect(() => {
    const request = () => {
      if (query) {
        getTransactions(0, query);
      } else {
        setTransactions([]);
        setSections([]);
        setOffset(0);
        setAreMoreTransactions(false);
      }
    };
    const timeout = setTimeout(request, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <Container noScroll disableFeedback safeAreaTop>
      <HStack
        _android={{ mt: 3 }}
        _ios={{ mt: 1 }}
        justifyContent="space-between"
        alignItems="center"
        space={2}>
        <BackButton />
        <Input
          autoFocus
          autoCapitalize="sentences"
          placeholder="Busca movimientos"
          fontSize="sm"
          variant="unstyled"
          returnKeyType="search"
          flex={1}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => {}}
          InputLeftElement={<Icon as={Feather} name="search" my={2} size={6} />}
          InputRightElement={
            query && (
              <Pressable
                onPress={() => {
                  setQuery("");
                }}>
                <Icon as={Feather} name="x" my={2} mx={1} size={6} />
              </Pressable>
            )
          }
        />
      </HStack>
      <SectionList
        refreshControl={<RefreshControl refreshing={isRefreshing} />}
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
              onPress={() => getTransactions(offset + 20, query)}
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

export default Search;
