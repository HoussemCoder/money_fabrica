/* handling contact post form with Ajax */

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".contact-detail").addEventListener("submit", function(event) {
        event.preventDefault();

        const form_data = new FormData(event.target);

        const xhr = new XMLHttpRequest();

        xhr.open("POST", "");

        xhr.onload = function() {
            const email_error_msg = document.querySelector(".email-error-msg");
            const error_msg = document.querySelector(".error-msg");
            const response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                if (response.success) {
                    const body = document.querySelector(".overlay");
                    const window = document.querySelector(".send-contact-window");
                    const all_inputs = document.querySelectorAll(".form-field");

                    email_error_msg.style.display = "none";
                    error_msg.style.display = "none";
                    body.style.display = "block";
                    window.style.display = "block";
                    for (let field of all_inputs) {
                        field.value = "";
                    }
                } else {
                    if (response.email_error) {
                        email_error_msg.textContent = response.message;
                        email_error_msg.style.display = "inline-block";
                    } else {
                        error_msg.textContent = response.message;
                        error_msg.style.display = "inline-block";
                    }
                }
            } else {
                error_msg.textContent = "Something went wrong! please reload the page and try again";
                error_msg.style.display = "inline-block";
            }
        }
        xhr.send(form_data);
    });
});