import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Heading,
  HStack,
  Icon,
  IconButton,
  Pressable,
  Text,
} from "native-base";
import DraggableFlatList from "react-native-draggable-flatlist";
import Feather from "react-native-vector-icons/Feather";
import BackButton from "../../components/backButton";
import Container from "../../components/container";
import colors from "../../constants/colors";
import Br from "../../components/br";
import { StateContext } from "../../contexts/state";
import routes from "../../routes";

const Clients = props => {
  const { navigation } = props;
  const state = useContext(StateContext);
  const [clients, setClients] = useState(state.clients);

  useEffect(() => {
    setClients(state.clients);
  }, [state.clients]);

  return (
    <Container noScroll disableFeedback safeAreaTop safeAreaBottom>
      <HStack alignItems="center" mt={2} mb={5}>
        <BackButton />
        <Heading flex={1} textAlign="center">
          Clientes
        </Heading>
        <BackButton hidden />
      </HStack>
      <Box flex={1} borderRadius="xl" overflow="hidden">
        <DraggableFlatList
          data={clients}
          renderItem={({ item, drag, isActive, index }) => (
            <HStack
              alignItems="center"
              space={2}
              _light={{ bg: colors.blueGray[200] }}
              _dark={{ bg: colors.blueGray[800] }}>
              <Pressable
                flex={1}
                paddingX={3}
                minHeight="55px"
                onPress={() => navigation.navigate(routes.client, item)}
                justifyContent="center">
                <Text numberOfLines={1}>{item.name}</Text>
              </Pressable>
              <IconButton
                padding={1}
                variant="unstyled"
                onLongPress={drag}
                disabled={isActive}
                delayLongPress={100}
                icon={<Icon as={Feather} name="menu" size="lg" />}
              />
            </HStack>
          )}
          showsVerticalScrollIndicator={false}
          onDragEnd={({ data }) => setClients(data)}
          keyExtractor={item => String(item.id)}
          ItemSeparatorComponent={() => <Br size={1} />}
          ListFooterComponent={() => (
            <Pressable onPress={() => navigation.navigate(routes.client)}>
              <HStack
                px={3}
                minH="55px"
                mt="1px"
                alignItems="center"
                space={2}
                borderBottomRadius="xl"
                _light={{ bg: colors.blueGray[200] }}
                _dark={{ bg: colors.blueGray[800] }}>
                <Icon as={Feather} name="plus" size="lg" />
                <Text>Añadir cliente</Text>
              </HStack>
            </Pressable>
          )}
        />
      </Box>
    </Container>
  );
};

export default Clients;
