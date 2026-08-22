export async function onRequestPost(context) {
    try {
        const body = await context.request.json();

        const cleanName =
            typeof body.name === "string"
                ? body.name.trim()
                : "";

        const cleanEmail =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const website =
            typeof body.website === "string"
                ? body.website.trim()
                : "";

        if (website) {
            return Response.json({
                success: true,
                message: "Thank you for subscribing."
            });
        }

        if (!cleanName || !cleanEmail) {
            return Response.json({
                success: false,
                error: "Please complete all fields."
            }, { status: 400 });
        }

        if (cleanName.length > 200) {
            return Response.json({
                success: false,
                error: "Name is too long."
            }, { status: 400 });
        }

        if (cleanEmail.length > 320) {
            return Response.json({
                success: false,
                error: "Email address is too long."
            }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return Response.json({
                success: false,
                error: "Please enter a valid email address."
            }, { status: 400 });
        }

        if (!context.env.CRM_SUBSCRIBER_SECRET) {
            console.error("CRM subscriber secret is not configured.");

            return Response.json({
                success: false,
                error: "Unable to subscribe. Please try again."
            }, { status: 500 });
        }

        const crmResponse = await fetch(
            "https://crm.complexityclarified.co.uk/api/subscribe",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CRM-API-Key":
                        context.env.CRM_SUBSCRIBER_SECRET
                },
                body: JSON.stringify({
                    name: cleanName,
                    email: cleanEmail
                })
            }
        );

        const result = await crmResponse.json();

        if (!crmResponse.ok || !result.success) {
            console.error("CRM subscriber error:", result);

            return Response.json({
                success: false,
                error: "Unable to subscribe. Please try again."
            }, { status: 502 });
        }

        return Response.json({
            success: true,
            message:
                result.message ||
                "Thank you for subscribing."
        });
    } catch (error) {
        console.error("Subscriber form error:", error);

        return Response.json({
            success: false,
            error: "Unable to subscribe. Please try again."
        }, { status: 500 });
    }
}
