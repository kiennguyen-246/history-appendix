import { sql } from "@vercel/postgres";

export async function POST(req) {
    const { keywordCode, keyword, content, pageNumber, topic, bookCode } =
        JSON.parse(req.body);
    console.log(keywordCode, keyword, content, pageNumber, topic, bookCode);
    const result =
        await sql`INSERT INTO Keywords (keywordCode, keyword, content, pageNumber, topic, bookCode)
        VALUES (${keywordCode}, ${keyword}, ${content}, ${pageNumber}, ${topic}, ${bookCode})`;
    return Response.json({
        status: 200,
        message: "OK",
        data: result,
    });
}
