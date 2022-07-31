import React from "react";
import PropTypes from "prop-types";
import { Icon, IconButton } from "native-base";
import Feather from "react-native-vector-icons/Feather";
import colors from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

const BackButton = ({ hidden }) => {
  const navigation = useNavigation();

  return (
    <IconButton
      py={1}
      pr={1}
      pl={0}
      variant="unstyled"
      icon={
        <Icon
          as={Feather}
          name="arrow-left"
          size="xl"
          _light={{ color: hidden ? colors.transparent : colors.muted[900] }}
          _dark={{ color: hidden ? colors.transparent : colors.muted[50] }}
        />
      }
      onPress={navigation.goBack}
      disabled={hidden}
    />
  );
};

export default React.memo(BackButton);

BackButton.propTypes = {
  hidden: PropTypes.bool,
};

BackButton.defaultProps = {
  hidden: false,
};
