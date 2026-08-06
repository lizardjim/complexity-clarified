export async function onRequestPost(context) {

    try {

        const body = await context.request.json();

        const { name, email, message } = body;

        if (!name || !email || !message) {

            return Response.json(
                {
                    success: false,
                    error: "All fields are required."
                },
                {
                    status: 400
                }
            );

        }

        return Response.json({
            success: true,
            received: {
                name,
                email,
                message
            }
        });

    } catch {

        return Response.json(
            {
                success: false,
                error: "Invalid request."
            },
            {
                status: 400
            }
        );

    }

}