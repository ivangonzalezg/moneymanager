import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, HStack, Icon, Text, VStack } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../../constants/colors";

const KeyboardKey = ({ value, onPress, children }) => (
  <Button
    variant="ghost"
    flex={1}
    py={4}
    borderRadius="full"
    colorScheme="light"
    onPress={() => onPress(value)}>
    {children || <Text fontSize="2xl">{value}</Text>}
  </Button>
);

const VirtualKeyboard = props => {
  const [amount, setAmount] = useState(0);

  const onPress = (value = "", erase = false) => {
    let _amount = String(amount);
    if (erase) {
      _amount = String(_amount).slice(0, -1);
    } else {
      _amount = _amount + value;
    }
    if (_amount.length > 9) {
      return;
    }
    setAmount(Number(_amount));
    props.onPress(_amount);
  };

  return (
    <VStack px={5} space={2}>
      <HStack justifyContent="space-between" space={3}>
        <KeyboardKey value={1} onPress={onPress} />
        <KeyboardKey value={2} onPress={onPress} />
        <KeyboardKey value={3} onPress={onPress} />
      </HStack>
      <HStack justifyContent="space-between" space={3}>
        <KeyboardKey value={4} onPress={onPress} />
        <KeyboardKey value={5} onPress={onPress} />
        <KeyboardKey value={6} onPress={onPress} />
      </HStack>
      <HStack justifyContent="space-between" space={3}>
        <KeyboardKey value={7} onPress={onPress} />
        <KeyboardKey value={8} onPress={onPress} />
        <KeyboardKey value={9} onPress={onPress} />
      </HStack>
      <HStack justifyContent="space-between" space={3}>
        <KeyboardKey value="00" onPress={onPress} />
        <KeyboardKey value={0} onPress={onPress} />
        <KeyboardKey onPress={() => onPress("", true)}>
          <Icon
            as={MaterialCommunityIcons}
            name="backspace-outline"
            size={25}
            _light={{ color: colors.muted[900] }}
            _dark={{ color: colors.muted[50] }}
          />
        </KeyboardKey>
      </HStack>
    </VStack>
  );
};

export default VirtualKeyboard;

VirtualKeyboard.propTypes = {
  onPress: PropTypes.func.isRequired,
};
