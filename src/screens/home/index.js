import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
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
} from "../../utils";
import routes from "../../routes";
import { StateContext } from "../../contexts";
import database from "../../database";
import TransactionCard from "../../components/transactionCard";

const HomeScreen = props => {
  const { navigation } = props;
  const state = useContext(StateContext);
  const [monthExpenses, setMonthExpenses] = useState(0);
  const [sections, setSections] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const getTransactions = async () => {
    try {
      setIsRefreshing(true);
      const _monthExpenses = await database.getMonthExpenses();
      setMonthExpenses(_monthExpenses);
      const transactions = await database.getTransactions();
      setSections(transformTransactionsIntoSections(transactions));
    } catch (_) {}
    setIsRefreshing(false);
  };

  useEffect(() => {
    getTransactions();
  }, [state.transactions]);

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
          flex={1}
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
