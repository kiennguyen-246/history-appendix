import { getFilterResult } from "../services/filter";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { query } = req.body;
        const result = await getFilterResult(query);
        
        res.status(200).json({
            status: 200,
            message: "OK",
            data: result,
        });
    } else {
        res.status(405).json({
            status: 405,
            message: "Method not allowed",
        });
    }
}
