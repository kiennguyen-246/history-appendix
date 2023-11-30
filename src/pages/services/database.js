import mysql from "mysql2/promise";

export const mysqlConnection = await mysql.createConnection({
    host: "sql12.freemysqlhosting.net",
    user: "sql12666172",
    password: "VWuAcKuaae",
    database: "sql12666172",
});

