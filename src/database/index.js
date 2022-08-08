import SQLite from "react-native-sqlite-storage";
import moment from "moment";
import constants from "../constants";
import categories from "./categories";

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
        `CREATE TABLE IF NOT EXISTS ${name} (${fields.join(
          ", ",
        )}, created_at DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ')), updated_at DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ'))
        )`,
        [],
        resolve,
        reject,
      );
    }),
  );

const configure = async () => {
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
    ]),
    createTable(constants.tables.CATEGORIES, [
      "id INTEGER PRIMARY KEY",
      "position INTEGER NOT NULL",
      "name TEXT NOT NULL",
      "icon TEXT NOT NULL",
    ]),
  ]);
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

const createTransactions = (_transactions = []) =>
  new Promise(resolve =>
    executeSql(
      `INSERT INTO ${
        constants.tables.TRANSACTIONS
      } (id,amount,category_id,date,description,is_income) VALUES ${_transactions
        .map(
          transaction =>
            `(${transaction.id},${transaction.amount},${transaction.category_id},"${transaction.date}","${transaction.description}",${transaction.is_income})`,
        )
        .join(",")}`,
      [],
      () => resolve(true),
      () => resolve(false),
    ),
  );

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
      `SELECT t.*, c.name AS categoryName, c.icon AS categoryIcon FROM ${constants.tables.TRANSACTIONS} t JOIN categories c ON t.category_id = c.id ORDER BY date DESC, id DESC`,
      [],
      (_, results) => resolve(results.rows.raw()),
      () => resolve([]),
    ),
  );

const getMonthBalance = () =>
  new Promise(resolve =>
    executeSql(
      `SELECT SUM(CASE WHEN is_income = 1 THEN amount ELSE amount*-1 END) AS total FROM ${
        constants.tables.TRANSACTIONS
      } WHERE date >= "${moment()
        .startOf("month")
        .toISOString()}" AND date <= "${moment()
        .endOf("month")
        .toISOString()}"`,
      [],
      (_, results) => {
        if (results.rows.item(0).total !== null) {
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

const deleteAllTransactions = () =>
  new Promise(resolve =>
    executeSql(
      `DELETE FROM ${constants.tables.TRANSACTIONS}`,
      [],
      () => resolve(true),
      () => resolve(false),
    ),
  );

const createCategories = (_categories = categories) =>
  new Promise(resolve =>
    executeSql(
      `INSERT INTO ${
        constants.tables.CATEGORIES
      } (id,position,name,icon) VALUES ${_categories
        .map(
          category =>
            `(${category.id},${category.position},"${category.name}","${category.icon}")`,
        )
        .join(",")}`,
      [],
      () => resolve(true),
      () => resolve(false),
    ),
  );

const getCategories = () =>
  new Promise(resolve =>
    executeSql(
      `SELECT * FROM ${constants.tables.CATEGORIES} ORDER BY position ASC`,
      [],
      (_, results) => resolve(results.rows.raw()),
      () => resolve([]),
    ),
  );

const createCategory = (data = {}) =>
  new Promise(resolve =>
    executeSql(
      `INSERT INTO ${constants.tables.CATEGORIES} (${Object.keys(data).join(
        ",",
      )}) VALUES (${Object.keys(data)
        .map(() => "?")
        .join(",")})`,
      Object.values(data),
      () => resolve(true),
      () => resolve(false),
    ),
  );

const updateCategory = (id = 0, data = {}) =>
  new Promise(resolve =>
    executeSql(
      `UPDATE ${constants.tables.CATEGORIES} SET ${Object.keys(data)
        .map(key => `${key} = "${data[key]}"`)
        .join(", ")} WHERE id = ${id}`,
      [],
      () => resolve(true),
      () => resolve(false),
    ),
  );

const reorderCategories = (_categories = []) =>
  new Promise(resolve =>
    executeSql(
      `UPDATE ${constants.tables.CATEGORIES} SET position = CASE ${_categories
        .map(
          _category => `WHEN id = ${_category.id} THEN ${_category.position}`,
        )
        .join(" ")} END WHERE id IN (${_categories
        .map(_category => _category.id)
        .join(", ")})`,
      [],
      () => resolve(true),
      () => resolve(false),
    ),
  );

const deleteAllCategories = () =>
  new Promise(resolve =>
    executeSql(
      `DELETE FROM ${constants.tables.CATEGORIES}`,
      [],
      () => resolve(true),
      () => resolve(false),
    ),
  );

const getAllTableData = (table = "") =>
  new Promise(resolve =>
    executeSql(
      `SELECT * FROM ${table}`,
      [],
      (_, results) => resolve(results.rows.raw()),
      () => resolve([]),
    ),
  );

const database = {
  configure,
  createTransactions,
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactions,
  getMonthBalance,
  createCategories,
  getCategories,
  createCategory,
  updateCategory,
  reorderCategories,
  deleteAllCategories,
  getAllTableData,
};

export default database;
