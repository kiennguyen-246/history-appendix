import { submitFeedback } from "../../services/feedback";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, feedback } = req.body;
        const result = await submitFeedback(email, feedback);

        if (!result) {
            res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        } else {
            res.status(200).json({
                status: 200,
                message: "OK",
            });
        }
    } else {
        res.status(405).json({
            status: 405,
            message: "Method not allowed",
        });
    }
}
