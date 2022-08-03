import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
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
import Emoji from "../../components/emoji";

const Categories = props => {
  const { navigation } = props;
  const state = useContext(StateContext);
  const [categories, setCategories] = useState(state.categories);

  useEffect(() => {
    setCategories(state.categories);
  }, [state.categories]);

  const hasChanged =
    JSON.stringify(state.categories) === JSON.stringify(categories);

  return (
    <Container noScroll disableFeedback safeAreaTop safeAreaBottom>
      <HStack alignItems="center" mt={2} mb={5}>
        <BackButton />
        <Heading flex={1} textAlign="center">
          Categorías
        </Heading>
        <BackButton hidden />
      </HStack>
      <Box flex={1} borderRadius="xl" overflow="hidden">
        <DraggableFlatList
          data={categories}
          renderItem={({ item, drag, isActive, index }) => (
            <HStack
              px={3}
              minH="55px"
              alignItems="center"
              space={2}
              borderTopRadius={index === 0 ? "xl" : "none"}
              _light={{ bg: colors.blueGray[200] }}
              _dark={{ bg: colors.blueGray[800] }}>
              <Pressable
                flex={1}
                onPress={() => navigation.navigate(routes.category, item)}>
                <HStack alignItems="center" space={2}>
                  <Emoji shortName={item.icon} fontSize="xl" />
                  <Text flex={1} numberOfLines={1}>
                    {item.name}
                  </Text>
                </HStack>
              </Pressable>
              <IconButton
                p={1}
                variant="unstyled"
                onLongPress={drag}
                disabled={isActive}
                delayLongPress={100}
                icon={<Icon as={Feather} name="menu" size="lg" />}
              />
            </HStack>
          )}
          showsVerticalScrollIndicator={false}
          onDragEnd={({ data: _data }) => setCategories(_data)}
          keyExtractor={item => String(item.id)}
          ItemSeparatorComponent={() => <Br size={1} />}
          ListFooterComponent={() => (
            <Pressable
              onPress={() =>
                navigation.navigate(routes.category, {
                  position: categories.length + 1,
                })
              }>
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
                <Text>Añadir categoría</Text>
              </HStack>
            </Pressable>
          )}
        />
      </Box>
      <Button mt={5} disabled={hasChanged}>
        Guardar
      </Button>
    </Container>
  );
};

export default Categories;
