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
          const email_input = document.querySelector(".email-input");
          const response = JSON.parse(xhr.responseText);
          var success = response.success;
          var message = response.message;
          if (success) {
            const enc_email = document.querySelector(".enc_email");
            const body = document.querySelector(".overlay");
            const all_elements = document.querySelectorAll(".success-window");
            var element;
            if_success(enc_email, body, all_elements, element)
          } else {
            const exist_email = response.exist;
            if (exist_email) {
              const submit_btn = document.querySelector(".submit-newsletter");
              const delete_area = document.querySelector(".delete-area");
              const delete_email = response.delete;
              if (delete_email) {
                
              }

              error_msg.textContent = message;
              submit_btn.style.display = "none";
              delete_area.style.display = "flex";
            }
            if (email_input !== null) {
              email_input.classList.add("shake");
              setTimeout(() => {email_input.classList.remove("shake")}, 300)
            }
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


function if_success(enc_email, body, all_elements, element) {
  if (all_elements.length > 1) {
    element = all_elements[1];
  } else {
    element = all_elements[0];
  }
  
  error_msg.style.display = "none"
  body.style.display = "block";
  element.style.display = "block";
  enc_email.textContent = message;
  if (email_input !== null) {
    email_input.value = "";
  }
}