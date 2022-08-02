import moment from "moment";
import numbro from "numbro";
import * as RNLocalize from "react-native-localize";
import { Linking } from "react-native";

const is24Hour = RNLocalize.uses24HourClock();

const formatToCurrency = (number = 0) =>
  numbro(Math.ceil(Number(number))).formatCurrency({
    thousandSeparated: true,
  });

const capitalize = (string = "") =>
  `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`;

const isSameDate = (a = moment(), b = moment()) =>
  a.format(moment.HTML5_FMT.DATE) === b.format(moment.HTML5_FMT.DATE);

const formatDate = (
  dateTime = moment(),
  includeTime = true,
  includeDay = false,
) => {
  const day = dateTime.format("dddd");
  const hour = dateTime.hour();
  const isToday = isSameDate(dateTime, moment());
  const isYesterday = isSameDate(dateTime, moment().subtract(1, "day"));
  const date = isToday
    ? `hoy${includeTime ? "," : ""}`
    : isYesterday
    ? `ayer${includeTime ? "," : ""}`
    : `${dateTime.format("MMM D").replace(/\./, "")}${
        includeTime ? ` a la${hour !== 1 ? "s" : ""}` : ""
      }`;
  return `${
    includeDay && !isToday && !isYesterday ? `${capitalize(day)}, ` : ""
  }${capitalize(date)}${
    includeTime ? dateTime.format(is24Hour ? " H:mm" : " h:mm A") : ""
  }`;
};

const getCategory = (id = 0, categories = []) =>
  categories.find(category => category.id === id) || null;

const transformTransactionsIntoSections = (transactions = []) => {
  const dates = transactions
    .map(transaction => moment(transaction.date).format(moment.HTML5_FMT.DATE))
    .filter((thing, index, self) => index === self.findIndex(t => t === thing));
  return dates.map(date => ({
    title: formatDate(moment(date), false, true),
    total: transactions
      .filter(
        transaction =>
          moment(transaction.date).format(moment.HTML5_FMT.DATE) === date,
      )
      .reduce((total, transaction) => total + transaction.amount, 0),
    data: transactions.filter(
      transaction =>
        moment(transaction.date).format(moment.HTML5_FMT.DATE) === date,
    ),
  }));
};

const openUrl = url =>
  Linking.canOpenURL(url)
    .then(supported => supported && Linking.openURL(url))
    .catch(() => {});

export {
  formatToCurrency,
  formatDate,
  is24Hour,
  getCategory,
  transformTransactionsIntoSections,
  openUrl,
};
