import { mysqlConnection } from "./database";
import env from "dotenv";
import "dotenv/config"

export async function getSearchResult(keyword) {
    const [rows, fields] = await mysqlConnection.execute(
        `SELECT Keywords.*, Books.bookName
         FROM Keywords
         JOIN Books ON Keywords.bookCode = Books.bookCode
         WHERE keyword = '${keyword}'`
    );
    return rows.length > 0 ? rows[0] : null;
}
