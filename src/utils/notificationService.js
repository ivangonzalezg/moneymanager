import { Platform } from "react-native";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import constants from "../constants";

const isIOS = Platform.OS === "ios";
const isAndroid = Platform.OS === "android";

const title = "Recordatorio diario";
const body = "Es tiempo de guardar tus gastos";

if (isAndroid) {
  PushNotification.createChannel({
    channelId: constants.channelId,
    channelName: "Money Manager",
    playSound: true,
    soundName: "default",
  });
}

const getInitialNotification = (callback = () => {}) => {
  if (isIOS) {
    PushNotificationIOS.getInitialNotification().then(notification => {
      if (notification) {
        callback();
      }
    });
  }
};

const startListener = (callback = () => {}) => {
  if (isIOS) {
    PushNotificationIOS.addEventListener("localNotification", _notification => {
      if (_notification.getData().userInteraction === 1) {
        callback();
      }
      _notification.finish(PushNotificationIOS.FetchResult.NoData);
    });
  } else if (isAndroid) {
    PushNotification.configure({
      onNotification: function (notification) {
        if (notification.userInteraction) {
          callback();
        }
      },
      permissions: { alert: true, badge: true, sound: true },
      popInitialNotification: true,
      requestPermissions: false,
    });
  }
};

const getScheduledNotifications = (callback = () => {}) => {
  if (isIOS) {
    PushNotificationIOS.getPendingNotificationRequests(callback);
  } else if (isAndroid) {
    PushNotification.getScheduledLocalNotifications(callback);
  }
};

const createScheduledNotifications = (date = new Date()) => {
  if (isIOS) {
    PushNotificationIOS.addNotificationRequest({
      id: constants.notificationId,
      title,
      body,
      fireDate: date,
      repeats: true,
      repeatsComponent: {
        hour: true,
        minute: true,
      },
      badge: 1,
    });
  } else if (isAndroid) {
    PushNotification.cancelAllLocalNotifications();
    PushNotification.localNotificationSchedule({
      channelId: constants.channelId,
      title,
      message: body,
      vibrate: true,
      allowWhileIdle: true,
      date,
      repeatTime: 1,
      repeatType: "day",
    });
  }
};

const cancelScheduledNotifications = () => {
  if (isIOS) {
    PushNotificationIOS.removeAllPendingNotificationRequests();
  } else if (isAndroid) {
    PushNotification.cancelAllLocalNotifications();
  }
};

const checkPermissions = async () => {
  if (isIOS) {
    return new Promise(resolve => {
      PushNotificationIOS.checkPermissions(async permissions => {
        if (permissions.authorizationStatus !== 2) {
          const _permissions = await PushNotificationIOS.requestPermissions({
            alert: true,
            sound: true,
            badge: true,
          });
          resolve(_permissions.authorizationStatus === 2);
        } else {
          resolve(true);
        }
      });
    });
  } else if (isAndroid) {
    return true;
  }
};

const clearBadge = () => {
  if (isIOS) {
    PushNotificationIOS.setApplicationIconBadgeNumber(0);
    PushNotificationIOS.removeAllDeliveredNotifications();
  } else if (isAndroid) {
    PushNotification.setApplicationIconBadgeNumber(0);
    PushNotification.removeAllDeliveredNotifications();
  }
};

const test = () => {
  if (isIOS) {
    PushNotificationIOS.addNotificationRequest({
      id: constants.notificationId,
      title,
      body,
      badge: 1,
    });
  } else if (isAndroid) {
    PushNotification.localNotification({
      channelId: constants.channelId,
      title,
      message: body,
      vibrate: true,
    });
  }
};

const notificationService = {
  getInitialNotification,
  startListener,
  getScheduledNotifications,
  createScheduledNotifications,
  cancelScheduledNotifications,
  checkPermissions,
  clearBadge,
  test,
};

export default notificationService;
