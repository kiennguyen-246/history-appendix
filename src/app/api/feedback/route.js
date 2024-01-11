import { submitFeedback } from "./feedback";

export async function POST(req) {
    const { email, feedback } = await req.json();
    const result = await submitFeedback(email, feedback);

    if (!result) {
        return Response.json({
            status: 500,
            message: "Internal server error",
        });
    } else {
        return Response.json({
            status: 200,
            message: "OK",
        });
    }
}
