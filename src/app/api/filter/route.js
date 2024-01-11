import { getFilterResult } from "./filter";

export async function POST(req) {
    const { query } = await req.json();
    const result = await getFilterResult(query);

    return Response.json({
        status: 200,
        message: "OK",
        data: result,
    });
}
