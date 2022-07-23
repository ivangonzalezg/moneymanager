import React from "react";
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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import SimpleEmoji from "simple-react-native-emoji";
import styles from "./styles";
import Container from "../../components/container";
import { formatToCurrency } from "../../utils";
import colors from "../../constants/colors";
import Button from "../../components/button";

const transactions = [
  {
    title: "Hoy",
    data: [
      {
        id: 1,
        date: new Date(),
        categoryName: "Hogar",
        amount: 1000,
        categoryIcon: "house",
      },
      {
        id: 2,
        date: new Date(),
        categoryName: "Transporte",
        amount: 1000,
        categoryIcon: "car",
      },
      {
        id: 3,
        date: new Date(),
        categoryName: "Alimentación",
        amount: 1000,
        categoryIcon: "fork_and_knife",
      },
      {
        id: 4,
        date: new Date(),
        categoryName: "Hogar",
        amount: 1000,
        categoryIcon: "house",
      },
      {
        id: 5,
        date: new Date(),
        categoryName: "Transporte",
        amount: 1000,
        categoryIcon: "car",
        description: "Cogí una puerca para ir al centro",
      },
      {
        id: 6,
        date: new Date(),
        categoryName: "Alimentación",
        amount: 1000,
        categoryIcon: "fork_and_knife",
      },
    ],
  },
  {
    title: "Ayer",
    data: [
      {
        id: 7,
        date: new Date(),
        categoryName: "Hogar",
        amount: 1000,
        categoryIcon: "house",
      },
      {
        id: 8,
        date: new Date(),
        categoryName: "Transporte",
        amount: 1000,
        categoryIcon: "car",
      },
      {
        id: 9,
        date: new Date(),
        categoryName: "Alimentación",
        amount: 1000,
        categoryIcon: "fork_and_knife",
      },
      {
        id: 10,
        date: new Date(),
        categoryName: "Hogar",
        amount: 1000,
        categoryIcon: "house",
      },
      {
        id: 11,
        date: new Date(),
        categoryName: "Transporte",
        amount: 1000,
        categoryIcon: "car",
      },
      {
        id: 12,
        date: new Date(),
        categoryName: "Alimentación",
        amount: 1000,
        categoryIcon: "fork_and_knife",
      },
      {
        id: 13,
        date: new Date(),
        categoryName: "Hogar",
        amount: 1000,
        categoryIcon: "house",
      },
      {
        id: 14,
        date: new Date(),
        categoryName: "Transporte",
        amount: 1000,
        categoryIcon: "car",
      },
      {
        id: 15,
        date: new Date(),
        categoryName: "Alimentación",
        amount: 1000,
        categoryIcon: "fork_and_knife",
      },
      {
        id: 16,
        date: new Date(),
        categoryName: "Hogar",
        amount: 1000,
        categoryIcon: "house",
      },
      {
        id: 17,
        date: new Date(),
        categoryName: "Transporte",
        amount: 1000,
        categoryIcon: "car",
      },
      {
        id: 18,
        date: new Date(),
        categoryName: "Alimentación",
        amount: 1000,
        categoryIcon: "fork_and_knife",
      },
    ],
  },
];

const HomeScreen = () => {
  return (
    <Container noScroll>
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
          opacity={90}
          InputLeftElement={
            <Icon
              as={MaterialIcons}
              name="search"
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
            onPress={() => console.log("okk")}
          />
        </VStack>
      </HStack>
      <Center mt={5} mb={7}>
        <Text opacity={70}>Gastado esta mes</Text>
        <Heading fontSize="4xl">{formatToCurrency(1000)}</Heading>
      </Center>
      <SectionList
        sections={transactions}
        renderSectionHeader={({ section }) => (
          <Box
            _dark={{ bg: "blueGray.900" }}
            _light={{ bg: "blueGray.50" }}
            pb={1}>
            <Heading>{section.title}</Heading>
          </Box>
        )}
        renderItem={({ item }) => (
          <Button onPress={() => {}}>
            <HStack space={5} alignItems="center" my={3}>
              <SimpleEmoji shortName={item.categoryIcon} style={styles.icon} />
              <VStack flex={1}>
                <HStack flex={1} space={2}>
                  <VStack flex={1} justifyContent="center">
                    <Text bold>{item.categoryName}</Text>
                    {Boolean(item.description) && (
                      <Text numberOfLines={2} opacity={70}>
                        {item.description} {item.description} {item.description}
                      </Text>
                    )}
                  </VStack>
                  <VStack>
                    <Text bold>{formatToCurrency(item.amount)}</Text>
                    <Text alignSelf="flex-end" opacity={50}>
                      {moment(item.date).format(moment.HTML5_FMT.TIME)}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </HStack>
          </Button>
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={Divider}
        keyExtractor={item => String(item.id)}
      />
    </Container>
  );
};

export default HomeScreen;
