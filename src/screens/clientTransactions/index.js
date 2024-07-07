import React, { useEffect, useState } from "react";
import { FlatList, HStack, Heading } from "native-base";
import Container from "../../components/container";
import database from "../../database";
import { RefreshControl } from "react-native";
import TransactionCard from "../../components/transactionCard";
import BackButton from "../../components/backButton";

const ClientTransactions = props => {
  const {
    route: { params },
  } = props;
  const [transactions, setTransactions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getTransactions = async () => {
    try {
      let _transactions = await database.getTransactionsByClient(params.id);
      setTransactions(_transactions);
    } catch (_) {}
    setIsRefreshing(false);
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <Container noScroll disableFeedback safeAreaTop>
      <HStack
        _android={{ mt: 3 }}
        _ios={{ mt: 1 }}
        justifyContent="space-between"
        alignItems="center"
        space={2}>
        <BackButton />
        <Heading flex={1} textAlign="center" mt={2}>
          {params.name}
        </Heading>
      </HStack>
      <FlatList
        refreshControl={<RefreshControl refreshing={isRefreshing} />}
        marginTop={5}
        data={transactions}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <TransactionCard item={item} />}
      />
    </Container>
  );
};

export default ClientTransactions;
