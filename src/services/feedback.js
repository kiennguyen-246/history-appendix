import { mysqlConnection } from "./database";

export async function submitFeedback(email, feedback) {
    let [rows, fields] = await mysqlConnection.execute(
        `SELECT MAX(id) AS maxId FROM Feedbacks`
    );
    const id = rows[0].maxId + 1;
    [rows, fields] = await mysqlConnection.execute(
        `INSERT INTO Feedbacks (id, email, feedback)
         VALUES (${id}, '${email}', '${feedback}')`
    );
    return true;
}
