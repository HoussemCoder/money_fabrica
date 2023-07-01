/* handling the post forms with Ajax */

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".newsletter-form").addEventListener("submit", function(event) {
        event.preventDefault();
  
        const form_data = new FormData(event.target);
  
        const xhr = new XMLHttpRequest();
  
        xhr.open("POST", "newsletter/");
  
        xhr.onload = function() {
            const error_msg = document.querySelector(".error-msg");
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                const email_input = document.querySelector(".email-input");
                const enc_email = document.querySelector(".enc_email");
                const body = document.querySelector(".overlay");
                const success = response.success;
                const message = response.message;
                if (success) {
                    const element = document.querySelector(".send-email-window");
                    if_success(error_msg, enc_email, body, element, message, email_input)
                } else {
                    const exist_email = response.exist;
                    if (exist_email) {
                        const submit_btn = document.querySelector(".submit-newsletter");
                        const delete_area = document.querySelector(".delete-area");
                        const delete_decision = response.delete;
                        error_msg.textContent = message;
                        submit_btn.style.display = "none";
                        delete_area.style.display = "flex";
                        if (delete_decision) {
                            const element = document.querySelector(".delete-window");
                            if_success(error_msg, enc_email, body, element, message, email_input)
                            error_msg.style.display = "none";
                            delete_area.style.display = "none";
                            submit_btn.style.display = "inline-block";
                        } else if (delete_decision === false) {
                            error_msg.style.display = "none";
                            delete_area.style.display = "none";
                            submit_btn.style.display = "inline-block";
                            email_input.value = "";
                        }
                    }
                    if (email_input !== null) {
                        email_input.classList.add("shake");
                        setTimeout(() => {email_input.classList.remove("shake")}, 300)
                    }
                    error_msg.textContent = message;
                    error_msg.style.display = "inline-block";
                }
            } else {
            error_msg.textContent = "Something went wrong! please reload the page and try again";
            error_msg.style.display = "inline-block";
            }
        };
        xhr.send(form_data);
    });
});


function if_success(error_msg, enc_email, body, element, message, email_input) {
    error_msg.style.display = "none"
    body.style.display = "block";
    element.style.display = "block";
    enc_email.textContent = message;
    
    if (email_input !== null) {
    email_input.value = "";
    }
}