export async function onRequestPost(context) {

    try {

        const body = await context.request.json();

        return Response.json({
            success: true,
            received: body
        });

    } catch {

        return Response.json({
            success: false,
            error: "Invalid JSON"
        }, {
            status: 400
        });

    }

}