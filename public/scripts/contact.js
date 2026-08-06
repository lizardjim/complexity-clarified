const form = document.getElementById("contact-form");
const submitButton = document.getElementById("submit-button");
const messageBox = document.getElementById("form-message");

if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        messageBox.textContent = "";
        messageBox.className = "mb-3";

        submitButton.disabled = true;
        submitButton.value = "Sending...";

        const formData = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        try {

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {

                messageBox.classList.add("text-success");
                messageBox.textContent = result.message;

                form.reset();

            } else {

                messageBox.classList.add("text-danger");
                messageBox.textContent = result.error;

            }

        } catch (error) {

            console.error(error);

            messageBox.classList.add("text-danger");
            messageBox.textContent = "An unexpected error occurred. Please try again.";

        } finally {

            submitButton.disabled = false;
            submitButton.value = "Send Message";

        }

    });

}