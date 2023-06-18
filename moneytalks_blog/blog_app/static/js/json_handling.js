/* handling the post forms with Ajax */

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".newsletter-form").addEventListener("submit", function(event) {
      event.preventDefault();
  
      const form_data = new FormData(event.target);
  
      const xhr = new XMLHttpRequest();
  
      xhr.open("POST", "<path:path>");
  
      xhr.onload = function() {
        const error_msg = document.querySelector(".error-msg");
        if (xhr.status === 200) {
          const email_input = document.querySelector(".email-input");
          const response = JSON.parse(xhr.responseText);
          var success = response.success;
          var message = response.message;
          if (success) {
            const element = document.querySelector(".success-window");
            const enc_email = document.querySelector(".enc_email");
            const body = document.querySelector(".overlay");
            
            error_msg.style.display = "none"
            enc_email.textContent = message;
            body.style.display = "block";
            element.style.display = "block";
            email_input.value = "";
          } else {
            email_input.classList.add("shake");
            setTimeout(() => {email_input.classList.remove("shake")}, 300)
            error_msg.textContent = message;
            error_msg.style.display = "block";
          }
        } else {
          error_msg.textContent = "Something went wrong! please reload the page and try again";
          error_msg.style.display = "block";
        }
      };
      xhr.send(form_data);
    });
  });
  