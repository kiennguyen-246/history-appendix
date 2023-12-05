import { sql } from "@vercel/postgres";

export async function getSearchResult(keyword) {
    const result = await sql`
        SELECT Keywords.*, Books.bookName
         FROM Keywords
         JOIN Books ON Keywords.bookCode = Books.bookCode
         WHERE keyword = ${keyword};`;
    return result.rows.length > 0 ? result.rows[0] : null;
}
