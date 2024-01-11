import { getSearchResult } from "./search";

export async function POST(req) {
    const { keyword } = await req.json();
    const result = await getSearchResult(keyword);
    if (result == null) {
        return Response.json({
            status: 404,
            message: "Not found",
        });
    } else {
        return Response.json({
            status: 200,
            message: "OK",
            data: result,
        });
    }
}
