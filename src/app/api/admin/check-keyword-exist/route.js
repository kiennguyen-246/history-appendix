import { sql } from "@vercel/postgres";

export async function POST(req) {
    console.log(req.body);
    console.log(req.body.keywordCode);
    const result =
        await sql`SELECT COUNT(*) AS countExist FROM Keywords WHERE keywordCode = ${
            JSON.parse(req.body).keywordCode
        }`;
    return Response.json({
        status: 200,
        message: "OK",
        data: result.rows[0].countexist,
    });
}
