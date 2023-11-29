import { getSearchResult } from "../services/search";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { keyword } = req.body;
        const result = await getSearchResult(keyword);
        if (result == null) {
            res.status(404).json({
                status: 404,
                message: "Not found",
            });
        } else {
            res.status(200).json({
                status: 200,
                message: "OK",
                data: result,
            });
        }
    } else {
        res.status(405).json({
            status: 405,
            message: "Method not allowed",
        });
    }
}
