import { sql } from "@vercel/postgres";

export async function getAllKeywords() {
    // keyword = keyword.trim().toLowerCase();
    const result = await sql`
        SELECT keywordCode, keyword
         FROM Keywords`;
    return result.rows;
}
