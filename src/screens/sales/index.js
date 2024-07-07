import React, { useContext, useEffect, useState } from "react";
import {
  Center,
  Divider,
  FlatList,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Container from "../../components/container";
import database from "../../database";
import { StateContext } from "../../contexts";
import { formatToCurrency } from "../../utils";
import { Pressable, RefreshControl } from "react-native";
import routes from "../../routes";

const Sales = props => {
  const { navigation } = props;
  const state = useContext(StateContext);
  const [sales, setSales] = useState([]);
  const [isLoadingSales, setIsLoadingSales] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const getSales = async () => {
    try {
      setIsRefreshing(true);
      const _sales = await database.getSalesByClient();
      setSales(_sales);
      setIsRefreshing(false);
      setIsLoadingSales(false);
    } catch (_) {}
  };

  useEffect(() => {
    getSales();
  }, [state.transactions]);

  if (isLoadingSales) {
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

  if (sales.length === 0) {
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
    <Container safeAreaTop disableFeedback noScroll>
      <Heading textAlign="center" mt={2}>
        Balance por cliente
      </Heading>
      <FlatList
        refreshControl={<RefreshControl refreshing={isRefreshing} />}
        marginTop={5}
        data={sales}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => String(item.id)}
        renderItem={({ item: sale }) => (
          <HStack alignItems="center" marginY={3} space={3}>
            <Text bold flex={1} numberOfLines={1}>
              {sale.name}
            </Text>
            <Text
              bold
              _light={{ color: sale.total >= 0 ? "success.600" : "error.600" }}
              _dark={{ color: sale.total >= 0 ? "success.400" : "error.400" }}>
              {formatToCurrency(Math.abs(sale.total))}
            </Text>
            <Pressable
              onPress={() =>
                navigation.navigate(routes.clientTransactions, sale)
              }>
              <Icon
                as={MaterialCommunityIcons}
                name="history"
                size="lg"
                _light={{ color: "muted.900" }}
                _dark={{ color: "muted.50" }}
              />
            </Pressable>
            <Pressable>
              <Icon
                as={MaterialCommunityIcons}
                name="whatsapp"
                size="lg"
                _light={{ color: "green.600" }}
                _dark={{ color: "green.400" }}
              />
            </Pressable>
          </HStack>
        )}
        ItemSeparatorComponent={Divider}
        ListFooterComponent={Divider}
      />
    </Container>
  );
};

export default Sales;
