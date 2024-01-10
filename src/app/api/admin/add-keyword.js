import { sql } from "@vercel/postgres";

export default async function handle(req, res) {
    const { keywordCode, keyword, content, pageNumber, topic, bookCode } =
        JSON.parse(req.body);
    console.log(keywordCode, keyword, content, pageNumber, topic, bookCode);
    if (req.method === "POST") {
        const result =
            await sql`INSERT INTO Keywords (keywordCode, keyword, content, pageNumber, topic, bookCode)
        VALUES (${keywordCode}, ${keyword}, ${content}, ${pageNumber}, ${topic}, ${bookCode})`;
        return res.status(200).json({
            status: 200,
            message: "OK",
            data: result,
        });
    } else {
        return res.status(405).json({
            status: 405,
            message: "Method not allowed",
        });
    }
}
