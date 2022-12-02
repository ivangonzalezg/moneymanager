import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  Button,
  Heading,
  HStack,
  Pressable,
  Switch,
  Text,
  useDisclose,
} from "native-base";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import Container from "../../components/container";
import BackButton from "../../components/backButton";
import constants from "../../constants";
import { is24Hour } from "../../utils";
import notificationService from "../../utils/notificationService";

const Notifications = () => {
  const [isActivated, setIsActivated] = useState(false);
  const {
    isOpen: isDatePicker,
    onOpen: onOpenDatePicker,
    onClose: onCloseDatePicker,
  } = useDisclose();
  const [date, setDate] = useState(moment("20:00:00", "HH:mm:ss").toDate());

  useEffect(() => {
    notificationService.getScheduledNotifications(notifications => {
      const notification = notifications.find(
        _notification =>
          _notification.id === constants.notificationId ||
          Platform.OS === "android",
      );
      const _isActivated = Boolean(notification);
      setIsActivated(_isActivated);
      if (_isActivated) {
        setDate(
          moment(
            moment(notification.date).format("HH:mm") + ":00",
            "HH:mm:ss",
          ).toDate(),
        );
      }
    });
  }, []);

  const onSave = async () => {
    if (isActivated) {
      const permissionResult = await notificationService.checkPermissions();
      if (permissionResult) {
        notificationService.createScheduledNotifications(date);
      } else {
        // TODO: Show some alert about permissions denied
      }
    } else {
      notificationService.cancelScheduledNotifications();
    }
  };

  return (
    <Container disableFeedback safeAreaTop safeAreaBottom>
      <HStack alignItems="center" mt={2} mb={5}>
        <BackButton />
        <Heading flex={1} textAlign="center">
          Notificaciones
        </Heading>
        <BackButton hidden />
      </HStack>
      <HStack alignItems="center">
        <Text flex={1}>Activado</Text>
        <Switch
          isChecked={isActivated}
          onToggle={() => setIsActivated(!isActivated)}
        />
      </HStack>
      {isActivated && (
        <Pressable py={3} onPress={onOpenDatePicker} alignItems="center">
          <Text>Recibir notificación diariamente a las:</Text>
          <Text bold>
            {moment(date).format(is24Hour ? "HH:mm" : "hh:mm A")}
          </Text>
        </Pressable>
      )}
      <Button mt={5} onPress={onSave}>
        Guardar
      </Button>
      {__DEV__ && (
        <Button mt={5} onPress={notificationService.test}>
          Test
        </Button>
      )}
      <DatePicker
        modal
        mode="time"
        androidVariant="nativeAndroid"
        title="Seleccione una fecha y hora"
        confirmText="Confirmar"
        cancelText="Cancelar"
        open={isDatePicker}
        date={date}
        onConfirm={_date => {
          setDate(_date);
          onCloseDatePicker();
        }}
        onCancel={onCloseDatePicker}
      />
    </Container>
  );
};

export default Notifications;
