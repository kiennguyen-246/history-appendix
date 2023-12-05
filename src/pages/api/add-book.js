import { sql } from "@vercel/postgres";

export default async function handle(req, res) {
    console.log(req.body);
    if (req.method === "POST") {
        const result = await sql`
            INSERT INTO Books (
                bookCode,
                bookName
            ) VALUES (
                ${req.body.bookCode},
                ${req.body.bookName}
            );`;
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
