import { sql } from "@vercel/postgres";

export async function POST(req) {
    console.log(req.body);
    const result = await sql`
            INSERT INTO Books (
                bookCode,
                bookName
            ) VALUES (
                ${req.body.bookCode},
                ${req.body.bookName}
            );`;
    return Response.json({
        status: 200,
        message: "OK",
        data: result,
    });
}
