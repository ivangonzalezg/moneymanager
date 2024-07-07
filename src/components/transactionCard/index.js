import React from "react";
import { Divider, HStack, Pressable, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import routes from "../../routes";
import { formatToCurrency } from "../../utils";

const TransactionCard = props => {
  const { item } = props;
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.navigate(routes.transaction, item)}>
      <HStack space={5} alignItems="center" my={2}>
        <VStack flex={1}>
          <HStack flex={1} space={2}>
            <VStack flex={1} justifyContent="center">
              <Text bold>{item.clientName}</Text>
              {Boolean(item.description) && (
                <Text numberOfLines={1} opacity={70}>
                  {item.description}
                </Text>
              )}
            </VStack>
            <VStack>
              <Text
                bold
                alignSelf="flex-end"
                _light={item.is_income && { color: "success.600" }}
                _dark={item.is_income && { color: "success.400" }}>
                {formatToCurrency(item.amount)}
              </Text>
              <Text alignSelf="flex-end" opacity={70}>
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

export default TransactionCard;
