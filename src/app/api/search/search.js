import { sql } from "@vercel/postgres";
import { removeTone } from "../../utils/utils";

export async function getSearchResult(keyword) {
    keyword = keyword.trim().toLowerCase();
    let keywordCode = removeTone(keyword).replaceAll(/[\s-]/g, "");
    const result = await sql`
        SELECT Keywords.*, Books.bookName
         FROM Keywords
         JOIN Books ON Keywords.bookCode = Books.bookCode
         WHERE keywordCode = ${keywordCode};`;
    return result.rows.length > 0 ? result.rows[0] : null;
}
