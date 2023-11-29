import { submitFeedback } from "../services/feedback";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { query } = req.body;
        const result = await submitFeedback(query);
        
        res.status(200).json({
            status: 200,
            message: "OK",
        });
    } else {
        res.status(405).json({
            status: 405,
            message: "Method not allowed",
        });
    }
}
