import { sql } from "@vercel/postgres";

export default async function handle(req, res) {
    console.log(req.body);
    console.log(req.body.keywordCode);
    if (req.method === "POST") {
        const result =
            await sql`SELECT COUNT(*) AS countExist FROM Keywords WHERE keywordCode = ${JSON.parse(req.body).keywordCode}`;
        return res.status(200).json({
            status: 200,
            message: "OK",
            data: result.rows[0].countexist,
        });
    } else {
        return res.status(405).json({
            status: 405,
            message: "Method not allowed",
        });
    }
}
