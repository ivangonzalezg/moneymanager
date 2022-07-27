import React from "react";
import { Divider, HStack, Pressable, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import SimpleEmoji from "simple-react-native-emoji";
import moment from "moment";
import styles from "./styles";
import routes from "../../routes";
import { formatToCurrency, getCategory } from "../../utils";

const TransactionCard = props => {
  const { item } = props;
  const navigation = useNavigation();

  const category = getCategory(item.category_id);

  return (
    <Pressable onPress={() => navigation.navigate(routes.transaction, item)}>
      <HStack space={5} alignItems="center" my={2}>
        <SimpleEmoji shortName={category.icon} style={styles.icon} />
        <VStack flex={1}>
          <HStack flex={1} space={2}>
            <VStack flex={1} justifyContent="center">
              <Text fontSize="md" bold>
                {category.name}
              </Text>
              {Boolean(item.description) && (
                <Text fontSize="md" numberOfLines={1} opacity={70}>
                  {item.description}
                </Text>
              )}
            </VStack>
            <VStack>
              <Text
                bold
                fontSize="md"
                _light={item.is_income && { color: "success.700" }}
                _dark={item.is_income && { color: "success.500" }}>
                {formatToCurrency(item.amount)}
              </Text>
              <Text fontSize="md" alignSelf="flex-end" opacity={70}>
                {moment(item.date).format(moment.HTML5_FMT.TIME)}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </HStack>
      <Divider />
    </Pressable>
  );
};

export default React.memo(TransactionCard);