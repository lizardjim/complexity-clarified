
    document.querySelectorAll(".video-facade").forEach((facade) => {
        facade.addEventListener("click", () => {
            const videoId = facade.getAttribute("data-video-id");

            if (!videoId) return;

            const iframe = document.createElement("iframe");

            iframe.src =
                `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

            iframe.title = "YouTube video player";
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;

            iframe.style.position = "absolute";
            iframe.style.inset = "0";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "0";

            facade.replaceChildren(iframe);
        });
    });