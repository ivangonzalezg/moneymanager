import SQLite from "react-native-sqlite-storage";
import moment from "moment";
import constants from "../constants";

const dbName = "moneymanager.db";

let db;

const createDatabase = async () => {
  db = await SQLite.openDatabase({
    name: dbName,
    readOnly: false,
  });
};

const createTable = (name = "", fields = []) =>
  new Promise((resolve, reject) =>
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${name} (${fields.join(", ")})`,
        [],
        resolve,
        reject,
      );
    }),
  );

const configure = async () => {
  try {
    SQLite.enablePromise(true);
    await createDatabase();
    await Promise.all([
      createTable(constants.tables.TRANSACTIONS, [
        "id INTEGER PRIMARY KEY",
        "amount INTEGER",
        "category_id INTEGER",
        "date DATETIME",
        "description TEXT",
        "is_income BOOLEAN DEFAULT 0",
        "created_at DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ'))",
        "updated_at DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ'))",
      ]),
    ]);
  } catch (error) {
    console.error(error);
  }
};

const executeSql = (sqlStatement, _arguments, callback, errorCallback) => {
  if (!db) {
    errorCallback();
    return;
  }
  return db.transaction(
    tx => tx.executeSql(sqlStatement, _arguments, callback, errorCallback),
    [],
    () => {},
    () => {},
  );
};

const createTransaction = (data = {}) =>
  new Promise(resolve =>
    executeSql(
      `INSERT INTO ${constants.tables.TRANSACTIONS} (${Object.keys(data).join(
        ",",
      )}) VALUES (${Object.keys(data)
        .map(() => "?")
        .join(",")})`,
      Object.values(data),
      () => resolve(true),
      () => resolve(false),
    ),
  );

const getTransactions = () =>
  new Promise(resolve =>
    executeSql(
      `SELECT * FROM ${constants.tables.TRANSACTIONS} ORDER BY date DESC`,
      [],
      (_, results) => {
        const data = [];
        for (let i = 0; i < results.rows.length; i++) {
          data.push(results.rows.item(i));
        }
        resolve(data);
      },
      () => resolve([]),
    ),
  );

const getMonthExpenses = () =>
  new Promise(resolve =>
    executeSql(
      `SELECT SUM(amount) AS total FROM ${
        constants.tables.TRANSACTIONS
      } WHERE date >= "${moment()
        .startOf("month")
        .toISOString()}" AND date <= "${moment()
        .endOf("month")
        .toISOString()}" AND is_income = 0`,
      [],
      (_, results) => {
        if (results.rows.length > 0) {
          resolve(results.rows.item(0).total);
        } else {
          resolve(0);
        }
      },
      () => resolve(0),
    ),
  );

const updateTransaction = (id = 0, data = {}) =>
  new Promise(resolve =>
    executeSql(
      `UPDATE ${constants.tables.TRANSACTIONS} SET ${Object.keys(data)
        .map(key => `${key} = "${data[key]}"`)
        .join(", ")} WHERE id = ${id}`,
      [],
      () => resolve(true),
      () => resolve(false),
    ),
  );

const deleteTransaction = (id = 0) =>
  new Promise(resolve =>
    executeSql(
      `DELETE FROM ${constants.tables.TRANSACTIONS} WHERE id = ${id}`,
      [],
      () => resolve(true),
      () => resolve(false),
    ),
  );

const database = {
  configure,
  createTransaction,
  getTransactions,
  getMonthExpenses,
  updateTransaction,
  deleteTransaction,
};

export default database;
