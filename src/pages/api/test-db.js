import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
    const result = await sql`
                SELECT * FROM Feedbacks;`;
    res.status(200).json({
        status: 200,
        message: "OK",
        data: result,
    });
}
