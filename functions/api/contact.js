import { Resend } from "resend";

export async function onRequestPost(context) {
    const resend = new Resend(context.env.RESEND_API_KEY);

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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return Response.json({
                success: false,
                error: "Please enter a valid email address."
            }, { status: 400 });
        }

        // Send email
        const { data, error } = await resend.emails.send({
            from: "Complexity Clarified <noreply@complexityclarified.co.uk>",
            to: "james@complexityclarified.co.uk",
            replyTo: cleanEmail,
            subject: `New website enquiry from ${cleanName}`,
            text: `A new message has been submitted via the Complexity Clarified website.

Name:
${cleanName}

Email:
${cleanEmail}

Message:
${cleanMessage}`
        });

        if (error) {
            console.error("Resend Error:", error);

            return Response.json({
                success: false,
                error: error.message ?? JSON.stringify(error)
            }, { status: 500 });
        }

        // Send enquiry to CRM
        try {
            const crmResponse = await fetch(
                "https://crm.complexityclarified.co.uk/api/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CRM-API-Key": context.env.CRM_CONTACT_SECRET
                    },
                    body: JSON.stringify({
                        name: cleanName,
                        email: cleanEmail,
                        message: cleanMessage
                    })
                }
            );

            if (!crmResponse.ok) {
                console.error(
                    "CRM Error:",
                    await crmResponse.text()
                );
            }

        } catch (crmError) {
            console.error(
                "CRM sync failed:",
                crmError
            );
        }

        return Response.json({
            success: true,
            message: "Message sent successfully.",
            id: data?.id
        });

    } catch (error) {
        console.error("Server Error:", error);

        return Response.json({
            success: false,
            error: error.message ?? String(error)
        }, { status: 500 });
    }
}