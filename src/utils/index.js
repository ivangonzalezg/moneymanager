import moment from "moment";
import numbro from "numbro";
import * as RNLocalize from "react-native-localize";

const is24Hour = RNLocalize.uses24HourClock();

const formatToCurrency = (number = 0) => {
  return numbro(Math.ceil(Number(number))).format({
    output: "currency",
    thousandSeparated: true,
    spaceSeparated: true,
  });
};

const capitalize = (string = "") =>
  `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`;

const isSameDate = (a = moment(), b = moment()) =>
  a.format(moment.HTML5_FMT.DATE) === b.format(moment.HTML5_FMT.DATE);

const formatDate = (dateTime = moment()) => {
  const hour = dateTime.hour();
  const date = isSameDate(dateTime, moment())
    ? "hoy,"
    : isSameDate(dateTime, moment().subtract(1, "day"))
    ? "ayer,"
    : `${dateTime.format("MMM D").replace(/\./, "")} a la${
        hour !== 1 ? "s" : ""
      }`;

  return `${capitalize(date)} ${dateTime.format(is24Hour ? "H:mm" : "h:mm A")}`;
};

export { formatToCurrency, formatDate, is24Hour };
