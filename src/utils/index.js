import numbro from "numbro";

const formatToCurrency = (number = 0) => {
  return numbro(Math.ceil(Number(number))).format({
    output: "currency",
    thousandSeparated: true,
    spaceSeparated: true,
  });
};

export { formatToCurrency };
