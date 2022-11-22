import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Heading,
  HStack,
  Pressable,
  Switch,
  Text,
  useDisclose,
} from "native-base";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import Container from "../../components/container";
import BackButton from "../../components/backButton";
import { ProgressContext } from "../../contexts";
import constants from "../../constants";
import { is24Hour } from "../../utils";

const Notifications = () => {
  const progress = useContext(ProgressContext);
  const [isActivated, setIsActivated] = useState(false);
  const {
    isOpen: isDatePicker,
    onOpen: onOpenDatePicker,
    onClose: onCloseDatePicker,
  } = useDisclose();
  const [date, setDate] = useState(moment("20:00:00", "HH:mm:ss").toDate());

  useEffect(() => {
    progress.showProgressDialog("");
    PushNotificationIOS.getPendingNotificationRequests(notifications => {
      const notification = notifications.find(
        _notification => _notification.id === constants.notificationId,
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
      progress.hideProgressDialog();
    });
  }, []);

  const onSave = async () => {
    if (isActivated) {
      const permissionResult = await new Promise(resolve => {
        PushNotificationIOS.checkPermissions(async permissions => {
          if (Object.values(permissions).includes(false)) {
            try {
              await PushNotificationIOS.requestPermissions({
                alert: true,
                sound: true,
                badge: true,
              });
              resolve(true);
            } catch (error) {}
          } else {
            resolve(true);
          }
        });
      });
      if (permissionResult) {
        PushNotificationIOS.addNotificationRequest({
          id: constants.notificationId,
          title: "Recordatorio diario",
          body: "Es tiempo de guardar tus gastos",
          fireDate: date,
          repeats: true,
          repeatsComponent: {
            hour: true,
            minute: true,
          },
          badge: 1,
        });
      } else {
      }
    } else {
      PushNotificationIOS.removeAllPendingNotificationRequests();
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
        <Button
          mt={5}
          onPress={() =>
            PushNotificationIOS.addNotificationRequest({
              id: constants.notificationId,
              title: "Recordatorio diario",
              body: "Es tiempo de guardar tus gastos",
              badge: 1,
            })
          }>
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
