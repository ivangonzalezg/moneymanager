import React, { useState } from "react";
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
import styles from "./styles";
import BackButton from "../../components/backButton";
import Container from "../../components/container";
import categories from "../../constants/categories";
import SimpleEmoji from "simple-react-native-emoji";
import colors from "../../constants/colors";
import Br from "../../components/br";

const Categories = () => {
  const [data, setData] = useState(categories);

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
          data={data}
          renderItem={({ item, drag, isActive, index }) => (
            <HStack
              px={3}
              py={3}
              alignItems="center"
              space={2}
              borderTopRadius={index === 0 ? "xl" : "none"}
              _light={{ bg: colors.blueGray[200] }}
              _dark={{ bg: colors.blueGray[800] }}>
              <SimpleEmoji shortName={item.icon} style={styles.icon} />
              <Text flex={1} numberOfLines={1}>
                {item.name}
              </Text>
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
          onDragEnd={({ data: _data }) => setData(_data)}
          keyExtractor={item => String(item.id)}
          ItemSeparatorComponent={() => <Br size={1} />}
          ListFooterComponent={() => (
            <Pressable>
              <HStack
                px={3}
                py={3}
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
      <Button mt={5}>Guardar</Button>
    </Container>
  );
};

export default Categories;
