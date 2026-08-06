export async function onRequest(context) {

    return Response.json({
        success: true,
        message: "Cloudflare Functions are working!"
    });

}