import { removeTone } from "../../utils/utils";
import { sql } from "@vercel/postgres";

export async function getFilterResult(query) {
    query = removeTone(query).replaceAll(/[\s-]/g, "");
    const result = await sql`
        SELECT * FROM Keywords 
        WHERE keywordCode 
        LIKE ${"%" + query + "%"}
        LIMIT 6`;
    return result.rows;
}
