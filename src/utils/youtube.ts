export function getYouTubeId(url: string): string | null {
    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname === "youtu.be") {
            return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
        }

        const isYouTubeHost =
            parsedUrl.hostname === "youtube.com" ||
            parsedUrl.hostname.endsWith(".youtube.com");

        if (!isYouTubeHost) return null;

        if (parsedUrl.pathname === "/watch") {
            return parsedUrl.searchParams.get("v");
        }

        const [, route, id] = parsedUrl.pathname.split("/");

        if (["embed", "shorts", "live"].includes(route)) {
            return id ?? null;
        }
    } catch {
        return null;
    }

    return null;
}
