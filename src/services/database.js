import mysql from "mysql2/promise";
import "dotenv/config";

export const mysqlConnection = await mysql
    .createPool({
        host: "sql12.freemysqlhosting.net",
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    })
    .promise();
