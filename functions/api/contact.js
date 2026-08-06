export async function onRequestPost(context) {

    try {

        const body = await context.request.json();

        const { name, email, message } = body;

        // Trim whitespace
        const cleanName = name?.trim();
        const cleanEmail = email?.trim().toLowerCase();
        const cleanMessage = message?.trim();

        // Required fields
        if (!cleanName || !cleanEmail || !cleanMessage) {

            return Response.json({
                success: false,
                error: "Please complete all fields."
            }, { status: 400 });

        }

        // Length validation
        if (cleanName.length > 100) {

            return Response.json({
                success: false,
                error: "Name is too long."
            }, { status: 400 });

        }

        if (cleanMessage.length > 5000) {

            return Response.json({
                success: false,
                error: "Message is too long."
            }, { status: 400 });

        }

        // Email validation
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {

            return Response.json({
                success: false,
                error: "Please enter a valid email address."
            }, { status: 400 });

        }

        // Ready for sending...

        return Response.json({
            success: true,
            received: {
                name: cleanName,
                email: cleanEmail,
                message: cleanMessage
            }
        });

    }
    catch {

        return Response.json({
            success: false,
            error: "Invalid request."
        }, { status: 400 });

    }

}