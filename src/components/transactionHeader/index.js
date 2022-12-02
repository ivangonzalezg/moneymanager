import React from "react";
import { Box, Divider, HStack, Text } from "native-base";
import { formatToCurrency } from "../../utils";

const TransactionHeader = props => {
  const { section } = props;

  return (
    <Box pt={10} _dark={{ bg: "blueGray.900" }} _light={{ bg: "blueGray.50" }}>
      <HStack justifyContent="space-between" alignItems="center">
        <Text fontSize="sm" opacity={70}>
          {section.title}
        </Text>
        <Text fontSize="sm" opacity={70}>
          {formatToCurrency(section.total)}
        </Text>
      </HStack>
      <Divider mt={2} />
    </Box>
  );
};

export default TransactionHeader;
