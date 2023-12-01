import { removeTone } from "../utils/utils";
import { mysqlConnection } from "./database";

export async function getFilterResult(query) {
    query = removeTone(query).replaceAll(/[\s-]/g, "");
    const [rows, fields] = await mysqlConnection.execute(
        `SELECT * FROM Keywords 
        WHERE Keywords.keywordCode 
        REGEXP '[a-z0-9]*${query}[a-z0-9]*'
        LIMIT 0, 6`
    );

    return rows;
}
