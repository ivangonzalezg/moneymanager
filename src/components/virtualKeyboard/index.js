import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { HStack, Icon, Pressable, Text, VStack } from "native-base";
import Feather from "react-native-vector-icons/Feather";
import colors from "../../constants/colors";

const KeyboardKey = React.memo(({ value, onPress, children }) => (
  <Pressable
    flex={1}
    justifyContent="center"
    alignItems="center"
    onPress={() => onPress(value)}
    _pressed={{ opacity: 1 }}
    _light={{ _pressed: { bg: "muted.200" } }}
    _dark={{ _pressed: { bg: "muted.700" } }}>
    {children || <Text fontSize="2xl">{value}</Text>}
  </Pressable>
));

const VirtualKeyboard = props => {
  const { height } = props;
  const [amount, setAmount] = useState(0);

  const onPress = useCallback(
    (value = "") => {
      let _amount = String(amount);
      if (value === "") {
        _amount = String(_amount).slice(0, -1);
      } else {
        _amount = _amount + value;
      }
      if (_amount.length > 9) {
        return;
      }
      setAmount(Number(_amount));
      props.onPress(Number(_amount));
    },
    [amount],
  );

  return (
    <VStack h={`${height}px`}>
      <HStack flex={1}>
        <KeyboardKey value={1} onPress={onPress} />
        <KeyboardKey value={2} onPress={onPress} />
        <KeyboardKey value={3} onPress={onPress} />
      </HStack>
      <HStack flex={1}>
        <KeyboardKey value={4} onPress={onPress} />
        <KeyboardKey value={5} onPress={onPress} />
        <KeyboardKey value={6} onPress={onPress} />
      </HStack>
      <HStack flex={1}>
        <KeyboardKey value={7} onPress={onPress} />
        <KeyboardKey value={8} onPress={onPress} />
        <KeyboardKey value={9} onPress={onPress} />
      </HStack>
      <HStack flex={1}>
        <KeyboardKey value="00" onPress={onPress} />
        <KeyboardKey value={0} onPress={onPress} />
        <KeyboardKey onPress={() => onPress("", true)}>
          <Icon
            as={Feather}
            name="delete"
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
  height: PropTypes.number,
};

VirtualKeyboard.defaultProps = {
  height: 250,
};
