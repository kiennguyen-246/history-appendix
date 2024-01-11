import { getAllKeywords } from "./getall";

export async function GET() {
    const result = await getAllKeywords();
    let dict = {};
    result.forEach((item) => {
        let key = item.keyword.charAt(0).toUpperCase();
        let pattern = /[0-9"'-]/;
        if (pattern.test(key)) key = "#";
        if (dict[key] == undefined) {
            dict[key] = [];
        }
        dict[key].push({
            keywordCode: item.keywordCode,
            keyword: item.keyword,
        });
    });
    if (dict == null) {
        return Response.json({
            status: 404,
            message: "Not found",
        });
    } else {
        return Response.json({
            status: 200,
            message: "OK",
            data: dict,
        });
    }
}
