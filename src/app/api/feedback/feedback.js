import { sql } from "@vercel/postgres";

export async function submitFeedback(email, feedback) {
    let result = await sql`SELECT MAX(id) AS maxId FROM Feedbacks`;
    // console.log(result.rows[0].maxid);
    const id = result.rows[0].maxid + 1;
    // console.log(id, email, feedback);
    result = await sql`INSERT INTO Feedbacks (id, email, feedback)
         VALUES (${id}, ${email}, ${feedback})`;
    return true;
}
